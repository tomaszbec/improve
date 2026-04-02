import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

const TECHNOLOGIES = [
  { name: 'React', color: '#61dafb', slug: 'react-development' },
  { name: 'Vue.js', color: '#42b883', slug: 'vue-development' },
  { name: 'Angular', color: '#dd0031', slug: 'angular-development' },
  { name: 'Next.js', color: '#ffffff', slug: 'next-js-development' },
  { name: 'Node.js', color: '#68a063', slug: 'node-development' },
  { name: 'TypeScript', color: '#3178c6', slug: 'typescript-development' },
  { name: 'Python', color: '#ffd43b', slug: 'python-development' },
  { name: 'Go', color: '#00add8', slug: 'go-development' },
  { name: '.NET', color: '#512bd4', slug: 'dotnet-development' },
  { name: 'Java', color: '#f89820', slug: 'java-development' },
  { name: 'PHP', color: '#777bb4', slug: 'php-development' },
  { name: 'Flutter', color: '#02569b', slug: 'flutter-development' },
  { name: 'React Native', color: '#61dafb', slug: 'react-native-development' },
  { name: 'Swift', color: '#fa7343', slug: 'swift-development' },
  { name: 'Kotlin', color: '#7f52ff', slug: 'kotlin-development' },
  { name: 'PostgreSQL', color: '#336791', slug: 'postgresql-development' },
  { name: 'MongoDB', color: '#47a248', slug: 'mongodb-development' },
  { name: 'Redis', color: '#dc382d', slug: 'redis-development' },
  { name: 'Docker', color: '#2496ed', slug: 'docker-development' },
  { name: 'Kubernetes', color: '#326ce5', slug: 'kubernetes-development' },
  { name: 'AWS', color: '#ff9900', slug: 'aws-development' },
  { name: 'Azure', color: '#0078d4', slug: 'azure-development' },
  { name: 'GraphQL', color: '#e10098', slug: 'graphql-development' },
  { name: 'TensorFlow', color: '#ff6f00', slug: 'tensorflow-development' },
  { name: 'Figma', color: '#f24e1e', slug: 'figma-development' },
]

export function Technologies() {
  const { t } = useTranslation()
  const ref = useScrollReveal()
  const doubled = [...TECHNOLOGIES, ...TECHNOLOGIES]

  return (
    <section className="section" id="technologie" aria-labelledby="tech-title">
      <div className="section__container" ref={ref}>
        <div className="section__header">
          <span className="section__label">{t('tech.label')}</span>
          <h2 id="tech-title" className="section__title">
            {t('tech.title')}
          </h2>
          <p className="section__description">
            {t('tech.description')}
          </p>
        </div>
      </div>

      <div className="tech__track-wrapper">
        <div className="tech__track">
          {doubled.map((tech, i) => {
            const ItemContent = (
              <>
                <span
                  className="tech__item-dot"
                  style={{ color: tech.color, background: tech.color }}
                />
                {tech.name}
              </>
            )

            if (tech.slug) {
              return (
                <Link
                  key={`${tech.name}-${i}`}
                  to={`/technologies/${tech.slug}`}
                  className="tech__item tech__item--link"
                >
                  {ItemContent}
                </Link>
              )
            }

            return (
              <div key={`${tech.name}-${i}`} className="tech__item">
                {ItemContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
