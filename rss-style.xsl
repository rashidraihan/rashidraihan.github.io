<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/rss/channel">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="title"/></title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            background-color: #262624;
            color: #e5e3df;
            max-width: 700px;
            margin: 0 auto;
            padding: 2.5rem 1.5rem;
            line-height: 1.7;
          }
          a { color: #4a9eff; }
          .notice {
            border: 1px solid #444;
            border-radius: 8px;
            padding: 1rem 1.25rem;
            margin-bottom: 2rem;
            color: #a8a29e;
            font-size: 0.95rem;
          }
          h1 {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            font-size: 1.6rem;
          }
          .desc { color: #a8a29e; margin-bottom: 2rem; }
          .item {
            border-bottom: 1px solid #444;
            padding-bottom: 1.25rem;
            margin-bottom: 1.25rem;
          }
          .item h2 { font-size: 1.15rem; margin: 0 0 0.3rem; }
          .item .date { color: #888; font-size: 0.85rem; margin-bottom: 0.5rem; }
        </style>
      </head>
      <body>
        <div class="notice">
          This is a web feed, also known as an RSS feed. You can subscribe
          by copying this page's URL into a feed reader like Feedly or
          NetNewsWire.
        </div>

        <p><a href="https://rashidraihan.github.io/">&#8592; Go back to rashidraihan.github.io</a></p>

        <h1>📡 <xsl:value-of select="title"/></h1>
        <p class="desc">I'm Raihan Rashid, a software engineer in Dhaka. I write about machine learning, security, and whatever else I figure out along the way.</p>

        <p><a href="https://rashidraihan.github.io/">&#8592; Go back to rashidraihan.github.io</a></p>

        <h2>Recent posts</h2>
        <xsl:for-each select="item">
          <div class="item">
            <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
            <div class="date">Published: <xsl:value-of select="pubDate"/></div>
            <div><xsl:value-of select="description"/></div>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>