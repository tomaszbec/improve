<?php
// PHP Router for SPA (always include the main phtml entry point)
// Allow Cloudflare to cache for a long time (1 day), but keep browser cache shorter (1 hour)
header("Cache-Control: public, max-age=3600, s-maxage=86400");
include_once("index.phtml");
?>
