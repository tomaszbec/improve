package main

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

const maxRequestSize = 30 << 20

type article struct {
	ID                int64          `json:"id"`
	Slug              string         `json:"slug"`
	Title             string         `json:"title"`
	Image             string         `json:"image"`
	Thumbnail         string         `json:"thumbnail,omitempty"`
	Content           string         `json:"content"`
	Excerpt           string         `json:"excerpt"`
	Tags              []string       `json:"tags"`
	Category          string         `json:"category"`
	TitlePL           string         `json:"title_pl,omitempty"`
	ContentPL         string         `json:"content_pl,omitempty"`
	ExcerptPL         string         `json:"excerpt_pl,omitempty"`
	TagsPL            []string       `json:"tags_pl,omitempty"`
	CategoryPL        string         `json:"category_pl,omitempty"`
	Template          string         `json:"template"`
	Translations      map[string]any `json:"translations,omitempty"`
	SourceLanguage    string         `json:"source_language,omitempty"`
	TranslationStatus string         `json:"translation_status,omitempty"`
	Status            string         `json:"status"`
	PublishedAt       string         `json:"published_at"`
	UpdatedAt         string         `json:"updated_at"`
	AuthorName        string         `json:"author_name,omitempty"`
	AuthorSlug        string         `json:"author_slug,omitempty"`
	AuthorRole        string         `json:"author_role,omitempty"`
	AuthorSpecialty   string         `json:"author_specialty,omitempty"`
	AuthorBio         string         `json:"author_bio,omitempty"`
	AuthorMethodology string         `json:"author_methodology,omitempty"`
	AuthorAvatar      string         `json:"author_avatar,omitempty"`
	AuthorLinkedIn    string         `json:"author_linkedin_url,omitempty"`
	AuthorGitHub      string         `json:"author_github_url,omitempty"`
	AuthorTrust       string         `json:"author_trust_message,omitempty"`
	SEOTitle          string         `json:"seo_title,omitempty"`
	SEODesc           string         `json:"seo_description,omitempty"`
}

type server struct {
	db                                           *sql.DB
	imageDir, token, staticDir, paddleWebhookKey string
}

func main() {
	db, err := openDatabase()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	s := &server{
		db:               db,
		imageDir:         env("ARTICLE_IMAGE_DIR", "/data/images"),
		token:            os.Getenv("PUBLISHING_API_TOKEN"),
		staticDir:        env("STATIC_DIR", "/app/dist"),
		paddleWebhookKey: os.Getenv("PADDLE_WEBHOOK_SECRET"),
	}
	if s.token == "" {
		log.Fatal("PUBLISHING_API_TOKEN is required")
	}
	if err = os.MkdirAll(s.imageDir, 0755); err != nil {
		log.Fatal(err)
	}
	if err = migrate(db); err != nil {
		log.Fatal(err)
	}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", s.health)
	mux.HandleFunc("GET /api/health", s.health)
	mux.HandleFunc("POST /v1/publishing/articles", s.receiveArticle)
	mux.HandleFunc("DELETE /v1/publishing/articles/{slug}", s.unpublishArticle)
	mux.HandleFunc("GET /v1/articles", s.listArticles)
	mux.HandleFunc("GET /v1/articles/{slug}", s.getArticle)
	mux.HandleFunc("POST /v1/contact", s.receiveContact)
	mux.Handle("GET /generated/articles/", http.StripPrefix("/generated/articles/", http.FileServer(http.Dir(s.imageDir))))
	mux.HandleFunc("POST /api/v1/publishing/articles", s.receiveArticle)
	mux.HandleFunc("DELETE /api/v1/publishing/articles/{slug}", s.unpublishArticle)
	mux.HandleFunc("GET /api/v1/articles", s.listArticles)
	mux.HandleFunc("GET /api/v1/articles/{slug}", s.getArticle)
	mux.HandleFunc("POST /api/v1/contact", s.receiveContact)
	mux.HandleFunc("POST /api/webhooks/paddle", s.receivePaddleWebhook)
	mux.HandleFunc("GET /api/webhooks/paddle", s.receivePaddleWebhook)
	mux.Handle("GET /api/generated/articles/", http.StripPrefix("/api/generated/articles/", http.FileServer(http.Dir(s.imageDir))))
	mux.HandleFunc("GET /sitemap.xml", s.serveSitemap)
	mux.HandleFunc("GET /", s.serveSite)
	port := env("PORT", "8081")
	log.Printf("improveit Go API listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, cors(mux)))
}

func openDatabase() (*sql.DB, error) {
	db, err := sql.Open("pgx", env("DATABASE_URL", "postgres://improveit:improveit@postgres:5432/improveit?sslmode=disable"))
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	for {
		if err = db.PingContext(ctx); err == nil {
			return db, nil
		}
		select {
		case <-ctx.Done():
			db.Close()
			return nil, fmt.Errorf("database unavailable: %w", err)
		case <-time.After(time.Second):
		}
	}
}

func migrate(db *sql.DB) error {
	_, err := db.Exec(`
CREATE TABLE IF NOT EXISTS articles (
 id BIGSERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, image TEXT NOT NULL,
 thumbnail TEXT NOT NULL DEFAULT '', content TEXT NOT NULL, excerpt TEXT NOT NULL DEFAULT '',
 tags TEXT[] NOT NULL DEFAULT '{}', category TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'published',
 published_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 author_name TEXT NOT NULL DEFAULT '', author_slug TEXT NOT NULL DEFAULT '', seo_title TEXT NOT NULL DEFAULT '', seo_description TEXT NOT NULL DEFAULT ''
);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_pl TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_pl TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_pl TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tags_pl TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_pl TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS layout_template TEXT NOT NULL DEFAULT 'auto';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_profile JSONB NOT NULL DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_language TEXT NOT NULL DEFAULT 'en';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS translation_status TEXT NOT NULL DEFAULT 'translated';
CREATE INDEX IF NOT EXISTS articles_public_idx ON articles(status,published_at DESC);
CREATE TABLE IF NOT EXISTS contact_messages (
 id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT NOT NULL DEFAULT '',
 subject TEXT NOT NULL DEFAULT '', message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS paddle_webhook_events (
 id TEXT PRIMARY KEY, event_type TEXT NOT NULL, occurred_at TIMESTAMPTZ, payload JSONB NOT NULL,
 received_at TIMESTAMPTZ NOT NULL DEFAULT now(), processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS paddle_webhook_events_type_idx ON paddle_webhook_events(event_type,received_at DESC);
INSERT INTO articles(slug,title,image,content,excerpt,tags,category,status,published_at) VALUES
 ('przyszlosc-agentow-ai-w-biznesie','The Future of AI Agents in Business','/images/ai-dev.png','<p>Agentic systems are more than automation. They are autonomous solutions capable of reasoning and planning complex business tasks with minimal human intervention.</p>','How agentic systems are redefining how companies approach complex problems.',ARRAY['AI Agents','Business'],'AI Strategy','published','2024-03-15T00:00:00Z'),
 ('optymalizacja-llm-z-wykorzystaniem-rag','Optimizing LLMs with RAG','/images/ai-saas.png','<p>Retrieval-Augmented Generation connects language models with organizational knowledge, improving the accuracy, relevance and reliability of generated answers.</p>','Why Retrieval-Augmented Generation is key to building reliable solutions.',ARRAY['LLM','RAG'],'Technical','published','2024-03-10T00:00:00Z')
ON CONFLICT(slug) DO NOTHING;`)
	return err
}

func (s *server) health(w http.ResponseWriter, r *http.Request) {
	if s.db.PingContext(r.Context()) != nil {
		jsonOut(w, 503, map[string]bool{"ok": false})
		return
	}
	jsonOut(w, 200, map[string]bool{"ok": true})
}

func (s *server) receiveArticle(w http.ResponseWriter, r *http.Request) {
	provided := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if !hmac.Equal([]byte(provided), []byte(s.token)) {
		jsonOut(w, 401, map[string]string{"error": "invalid publishing token"})
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, maxRequestSize)
	if r.ParseMultipartForm(maxRequestSize) != nil {
		jsonOut(w, 400, map[string]string{"error": "invalid multipart payload"})
		return
	}
	var item article
	if json.Unmarshal([]byte(r.FormValue("article")), &item) != nil {
		jsonOut(w, 400, map[string]string{"error": "invalid article payload"})
		return
	}
	if !validSlug(item.Slug) || strings.TrimSpace(item.Title) == "" || strings.TrimSpace(item.Content) == "" {
		jsonOut(w, 400, map[string]string{"error": "slug, title and content are required"})
		return
	}
	if item.Template == "" {
		item.Template = "auto"
	}
	if item.Template != "auto" && item.Template != "image-left" && item.Template != "image-right" && item.Template != "image-top" {
		jsonOut(w, 400, map[string]string{"error": "invalid article template"})
		return
	}
	image, header, err := r.FormFile("image")
	if err != nil {
		jsonOut(w, 400, map[string]string{"error": "image is required"})
		return
	}
	defer image.Close()
	item.Image, err = s.storeImage(item.Slug, image, header)
	if err != nil {
		jsonOut(w, 400, map[string]string{"error": err.Error()})
		return
	}
	publishedAt := time.Now().UTC()
	if item.PublishedAt != "" {
		if parsed, e := time.Parse(time.RFC3339, item.PublishedAt); e == nil {
			publishedAt = parsed
		}
	}
	translations, _ := json.Marshal(item.Translations)
	authorProfile, _ := json.Marshal(map[string]string{"role": item.AuthorRole, "specialty": item.AuthorSpecialty, "bio": item.AuthorBio, "methodology": item.AuthorMethodology, "avatar": item.AuthorAvatar, "linkedin_url": item.AuthorLinkedIn, "github_url": item.AuthorGitHub, "trust_message": item.AuthorTrust})
	err = s.db.QueryRowContext(r.Context(), `INSERT INTO articles(slug,title,image,thumbnail,content,excerpt,tags,category,title_pl,content_pl,excerpt_pl,tags_pl,category_pl,layout_template,translations,status,published_at,author_name,author_slug,author_profile,seo_title,seo_description,source_language,translation_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,'published',$16,$17,$18,$19::jsonb,$20,$21,$22,$23) ON CONFLICT(slug) DO UPDATE SET title=excluded.title,image=excluded.image,thumbnail=excluded.thumbnail,content=excluded.content,excerpt=excluded.excerpt,tags=excluded.tags,category=excluded.category,title_pl=excluded.title_pl,content_pl=excluded.content_pl,excerpt_pl=excluded.excerpt_pl,tags_pl=excluded.tags_pl,category_pl=excluded.category_pl,layout_template=excluded.layout_template,translations=excluded.translations,status='published',published_at=excluded.published_at,author_name=excluded.author_name,author_slug=excluded.author_slug,author_profile=excluded.author_profile,seo_title=excluded.seo_title,seo_description=excluded.seo_description,source_language=excluded.source_language,translation_status=excluded.translation_status,updated_at=now() RETURNING id`, item.Slug, item.Title, item.Image, item.Thumbnail, item.Content, item.Excerpt, item.Tags, item.Category, item.TitlePL, item.ContentPL, item.ExcerptPL, item.TagsPL, item.CategoryPL, item.Template, string(translations), publishedAt, item.AuthorName, item.AuthorSlug, string(authorProfile), item.SEOTitle, item.SEODesc, item.SourceLanguage, item.TranslationStatus).Scan(&item.ID)
	if err != nil {
		log.Printf("article import: %v", err)
		jsonOut(w, 500, map[string]string{"error": "could not store published article"})
		return
	}
	jsonOut(w, 200, map[string]any{"id": item.ID, "slug": item.Slug, "image": item.Image})
}

func (s *server) unpublishArticle(w http.ResponseWriter, r *http.Request) {
	provided := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if !hmac.Equal([]byte(provided), []byte(s.token)) {
		jsonOut(w, http.StatusUnauthorized, map[string]string{"error": "invalid publishing token"})
		return
	}
	slug := r.PathValue("slug")
	if !validSlug(slug) {
		jsonOut(w, http.StatusNotFound, map[string]string{"error": "article not found"})
		return
	}
	result, err := s.db.ExecContext(r.Context(), `UPDATE articles SET status='draft',updated_at=now() WHERE slug=$1`, slug)
	if err != nil {
		log.Printf("article unpublish: %v", err)
		jsonOut(w, http.StatusInternalServerError, map[string]string{"error": "could not unpublish article"})
		return
	}
	updated, _ := result.RowsAffected()
	if updated == 0 {
		jsonOut(w, http.StatusNotFound, map[string]string{"error": "article not found"})
		return
	}
	jsonOut(w, http.StatusOK, map[string]any{"slug": slug, "status": "unpublished"})
}

const articleColumns = `id,slug,title,image,thumbnail,content,excerpt,array_to_json(tags),category,title_pl,content_pl,excerpt_pl,array_to_json(tags_pl),category_pl,layout_template,translations,status,published_at,updated_at,author_name,author_slug,author_profile,seo_title,seo_description,source_language,translation_status`

func scanArticle(scanner interface{ Scan(...any) error }) (article, error) {
	var a article
	var published, updated time.Time
	var tagsJSON, tagsPLJSON, translationsJSON, authorProfileJSON []byte
	err := scanner.Scan(&a.ID, &a.Slug, &a.Title, &a.Image, &a.Thumbnail, &a.Content, &a.Excerpt, &tagsJSON, &a.Category, &a.TitlePL, &a.ContentPL, &a.ExcerptPL, &tagsPLJSON, &a.CategoryPL, &a.Template, &translationsJSON, &a.Status, &published, &updated, &a.AuthorName, &a.AuthorSlug, &authorProfileJSON, &a.SEOTitle, &a.SEODesc, &a.SourceLanguage, &a.TranslationStatus)
	if err == nil {
		err = json.Unmarshal(translationsJSON, &a.Translations)
	}
	if err == nil {
		err = json.Unmarshal(tagsJSON, &a.Tags)
	}
	if err == nil {
		err = json.Unmarshal(tagsPLJSON, &a.TagsPL)
	}
	if err == nil {
		profile := map[string]string{}
		err = json.Unmarshal(authorProfileJSON, &profile)
		a.AuthorRole = profile["role"]
		a.AuthorSpecialty = profile["specialty"]
		a.AuthorBio = profile["bio"]
		a.AuthorMethodology = profile["methodology"]
		a.AuthorAvatar = profile["avatar"]
		a.AuthorLinkedIn = profile["linkedin_url"]
		a.AuthorGitHub = profile["github_url"]
		a.AuthorTrust = profile["trust_message"]
	}
	a.PublishedAt = published.UTC().Format(time.RFC3339)
	a.UpdatedAt = updated.UTC().Format(time.RFC3339)
	return a, err
}
func (s *server) listArticles(w http.ResponseWriter, r *http.Request) {
	rows, err := s.db.QueryContext(r.Context(), `SELECT `+articleColumns+` FROM articles WHERE status='published' ORDER BY published_at DESC`)
	if err != nil {
		jsonOut(w, 500, map[string]string{"error": "could not load articles"})
		return
	}
	defer rows.Close()
	items := []article{}
	for rows.Next() {
		if item, e := scanArticle(rows); e == nil {
			items = append(items, item)
		}
	}
	jsonOut(w, 200, map[string]any{"posts": items, "total": len(items)})
}
func (s *server) getArticle(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	if !validSlug(slug) {
		jsonOut(w, 404, map[string]string{"error": "article not found"})
		return
	}
	item, err := scanArticle(s.db.QueryRowContext(r.Context(), `SELECT `+articleColumns+` FROM articles WHERE slug=$1 AND status='published'`, slug))
	if err != nil {
		jsonOut(w, 404, map[string]string{"error": "article not found"})
		return
	}
	jsonOut(w, 200, item)
}

func (s *server) serveSite(w http.ResponseWriter, r *http.Request) {
	cleanPath := filepath.Clean("/" + r.URL.Path)
	if strings.HasPrefix(cleanPath, "/blog/") {
		slug := strings.TrimPrefix(cleanPath, "/blog/")
		if validSlug(slug) {
			if item, err := scanArticle(s.db.QueryRowContext(r.Context(), `SELECT `+articleColumns+` FROM articles WHERE slug=$1 AND status='published'`, slug)); err == nil {
				s.serveArticleHTML(w, item)
				return
			}
		}
	}
	target := filepath.Join(s.staticDir, strings.TrimPrefix(cleanPath, "/"))
	if info, err := os.Stat(target); err == nil && info.IsDir() {
		target = filepath.Join(target, "index.html")
	}
	if _, err := os.Stat(target); err != nil {
		target = filepath.Join(s.staticDir, "index.html")
	}
	http.ServeFile(w, r, target)
}

func (s *server) serveSitemap(w http.ResponseWriter, r *http.Request) {
	base, err := os.ReadFile(filepath.Join(s.staticDir, "sitemap.xml"))
	if err != nil {
		jsonOut(w, 500, map[string]string{"error": "sitemap unavailable"})
		return
	}
	rows, err := s.db.QueryContext(r.Context(), `SELECT slug,updated_at FROM articles WHERE status='published' ORDER BY updated_at DESC`)
	if err != nil {
		jsonOut(w, 500, map[string]string{"error": "sitemap unavailable"})
		return
	}
	defer rows.Close()
	staticSitemap := string(base)
	var dynamic strings.Builder
	for rows.Next() {
		var slug string
		var updated time.Time
		if rows.Scan(&slug, &updated) == nil {
			articleURL := "https://improveit.pl/blog/" + slug
			if !strings.Contains(staticSitemap, "<loc>"+articleURL+"</loc>") {
				fmt.Fprintf(&dynamic, "  <url><loc>%s</loc><lastmod>%s</lastmod><priority>0.7</priority></url>\n", html.EscapeString(articleURL), updated.UTC().Format("2006-01-02"))
			}
		}
	}
	result := strings.Replace(staticSitemap, "</urlset>", dynamic.String()+"</urlset>", 1)
	w.Header().Set("Content-Type", "application/xml; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=300")
	_, _ = io.WriteString(w, result)
}

func (s *server) serveArticleHTML(w http.ResponseWriter, item article) {
	shell, err := os.ReadFile(filepath.Join(s.staticDir, "index.html"))
	if err != nil {
		jsonOut(w, 500, map[string]string{"error": "application shell unavailable"})
		return
	}
	title, description := item.Title, item.Excerpt
	if item.SEOTitle != "" {
		title = item.SEOTitle
	}
	if item.SEODesc != "" {
		description = item.SEODesc
	}
	body := `<nav class="ssr-nav"><a href="/">improve<span>IT</span>.pl</a><div><a href="/services">Usługi</a><a href="/blog">Blog</a><a href="/contact">Kontakt</a></div></nav><main class="ssr-content"><article><a href="/blog">← Blog</a><h1>` + html.EscapeString(item.Title) + `</h1><p>` + html.EscapeString(item.Excerpt) + `</p><div class="published-article-content">` + sanitizePublishedHTML(item.Content) + `</div></article></main>`
	page := replaceTag(string(shell), "<title>", "</title>", "<title>"+html.EscapeString(title)+" | improveIT.pl</title>")
	page = replaceMeta(page, "description", description)
	page = strings.Replace(page, `href="https://improveit.pl/"`, `href="https://improveit.pl/blog/`+item.Slug+`"`, 1)
	page = replaceRoot(page, body)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=60, s-maxage=300")
	_, _ = io.WriteString(w, page)
}

func replaceTag(source, start, end, replacement string) string {
	a := strings.Index(source, start)
	if a < 0 {
		return source
	}
	b := strings.Index(source[a:], end)
	if b < 0 {
		return source
	}
	b += a + len(end)
	return source[:a] + replacement + source[b:]
}
func replaceRoot(source, body string) string {
	start := strings.Index(source, `<div id="root">`)
	end := strings.LastIndex(source, "</div>\n    <script type=\"module\"")
	if start < 0 || end < start {
		return source
	}
	return source[:start] + `<div id="root">` + body + source[end:]
}
func replaceMeta(source, name, value string) string {
	needle := `<meta name="` + name + `"`
	a := strings.Index(source, needle)
	if a < 0 {
		return source
	}
	b := strings.Index(source[a:], ">")
	if b < 0 {
		return source
	}
	b += a
	return source[:a] + `<meta name="` + name + `" content="` + html.EscapeString(value) + `" />` + source[b+1:]
}
func sanitizePublishedHTML(value string) string {
	lower := strings.ToLower(value)
	if strings.Contains(lower, "<script") || strings.Contains(lower, "javascript:") || strings.Contains(lower, " onerror=") || strings.Contains(lower, " onload=") {
		return `<p>` + html.EscapeString(value) + `</p>`
	}
	return value
}

func (s *server) receiveContact(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Company string `json:"company"`
		Subject string `json:"subject"`
		Message string `json:"message"`
	}
	if json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&input) != nil {
		jsonOut(w, 400, map[string]string{"error": "invalid JSON"})
		return
	}
	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)
	input.Message = strings.TrimSpace(input.Message)
	if input.Name == "" || input.Email == "" || !strings.Contains(input.Email, "@") || input.Message == "" {
		jsonOut(w, 400, map[string]string{"error": "name, email and message are required"})
		return
	}
	_, err := s.db.ExecContext(r.Context(), `INSERT INTO contact_messages(name,email,company,subject,message)VALUES($1,$2,$3,$4,$5)`, input.Name, input.Email, input.Company, input.Subject, input.Message)
	if err != nil {
		jsonOut(w, 500, map[string]string{"error": "could not store message"})
		return
	}
	jsonOut(w, 201, map[string]string{"status": "success"})
}

func (s *server) receivePaddleWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		jsonOut(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	if s.paddleWebhookKey == "" {
		jsonOut(w, http.StatusServiceUnavailable, map[string]string{"error": "webhook is not configured"})
		return
	}
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 1<<20))
	if err != nil || len(body) == 0 {
		jsonOut(w, http.StatusBadRequest, map[string]string{"error": "invalid webhook payload"})
		return
	}
	if err = verifyPaddleSignature(s.paddleWebhookKey, r.Header.Get("Paddle-Signature"), body, time.Now()); err != nil {
		jsonOut(w, http.StatusUnauthorized, map[string]string{"error": "invalid webhook signature"})
		return
	}
	var event struct {
		ID         string          `json:"event_id"`
		Type       string          `json:"event_type"`
		OccurredAt time.Time       `json:"occurred_at"`
		Data       json.RawMessage `json:"data"`
	}
	if json.Unmarshal(body, &event) != nil || event.ID == "" || event.Type == "" || len(event.Data) == 0 {
		jsonOut(w, http.StatusBadRequest, map[string]string{"error": "invalid webhook event"})
		return
	}
	if _, err = s.db.ExecContext(r.Context(), `INSERT INTO paddle_webhook_events(id,event_type,occurred_at,payload) VALUES($1,$2,$3,$4::jsonb) ON CONFLICT(id) DO NOTHING`, event.ID, event.Type, event.OccurredAt, string(body)); err != nil {
		log.Printf("paddle webhook persistence failed for event %q: %v", event.ID, err)
		jsonOut(w, http.StatusInternalServerError, map[string]string{"error": "could not store webhook event"})
		return
	}
	jsonOut(w, http.StatusOK, map[string]bool{"ok": true})
}

func verifyPaddleSignature(secret, header string, body []byte, now time.Time) error {
	var timestamp string
	var signatures []string
	for _, part := range strings.Split(header, ";") {
		key, value, ok := strings.Cut(strings.TrimSpace(part), "=")
		if !ok {
			continue
		}
		switch key {
		case "ts":
			timestamp = value
		case "h1":
			signatures = append(signatures, value)
		}
	}
	unix, err := time.Parse(time.RFC3339, time.Unix(parseUnix(timestamp), 0).UTC().Format(time.RFC3339))
	if err != nil || timestamp == "" || len(signatures) == 0 || parseUnix(timestamp) <= 0 {
		return errors.New("malformed Paddle-Signature header")
	}
	if delta := now.Sub(unix); delta < -5*time.Second || delta > 5*time.Second {
		return errors.New("expired Paddle signature")
	}
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write([]byte(timestamp + ":"))
	_, _ = mac.Write(body)
	expected := mac.Sum(nil)
	for _, candidate := range signatures {
		decoded, decodeErr := hex.DecodeString(candidate)
		if decodeErr == nil && hmac.Equal(expected, decoded) {
			return nil
		}
	}
	return errors.New("Paddle signature mismatch")
}

func parseUnix(value string) int64 {
	var unix int64
	_, _ = fmt.Sscan(value, &unix)
	return unix
}

func (s *server) storeImage(slug string, source multipart.File, header *multipart.FileHeader) (string, error) {
	data, err := io.ReadAll(io.LimitReader(source, 25<<20))
	if err != nil || len(data) == 0 {
		return "", errors.New("invalid image")
	}
	contentType := http.DetectContentType(data)
	ext, ok := map[string]string{"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}[contentType]
	if !ok {
		return "", fmt.Errorf("unsupported image type %q", contentType)
	}
	if header.Filename == "" {
		return "", errors.New("image filename is required")
	}
	digest := sha256.Sum256(data)
	filename := fmt.Sprintf("%s-%s%s", slug, hex.EncodeToString(digest[:6]), ext)
	if writeAtomic(filepath.Join(s.imageDir, filename), data) != nil {
		return "", errors.New("could not save image")
	}
	return "/generated/articles/" + filename, nil
}
func validSlug(v string) bool {
	return v != "" && filepath.Base(v) == v && v != "." && v != ".." && !strings.ContainsAny(v, "\\/")
}
func writeAtomic(path string, data []byte) error {
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, data, 0644); err != nil {
		return err
	}
	return os.Rename(tmp, path)
}
func jsonOut(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
func cors(next http.Handler) http.Handler {
	allowed := map[string]bool{
		"http://localhost:3002":    true,
		"http://localhost:3012":    true,
		"http://localhost:3200":    true,
		"http://localhost:5173":    true,
		"http://127.0.0.1:3012":    true,
		"http://127.0.0.1:3200":    true,
		"https://improveit.pl":     true,
		"https://www.improveit.pl": true,
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowed[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
func env(name, fallback string) string {
	if value := os.Getenv(name); value != "" {
		return value
	}
	return fallback
}
