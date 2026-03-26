import { Hono } from 'hono'
import type { Bindings } from '../types'

const app = new Hono<{ Bindings: Bindings }>()

const EMBED_JS = `(function(){
  var d=document,s=d.querySelector('[data-webring="ca"]'),b="https://webring.ca";
  if(!s){s=d.createElement("div");s.setAttribute("data-webring","ca");d.body.appendChild(s)}
  var slug=s.getAttribute("data-member")||"";
  var dark=s.getAttribute("data-theme")==="dark";
  var bg=dark?"#1a1a1a":"#fff";
  var fg=dark?"#e0e0e0":"#222";
  var ac=dark?"#f55":"#c22";
  var bd=dark?"#333":"#e0e0e0";
  var w=d.createElement("div");
  w.style.cssText="display:flex;gap:0.75rem;align-items:center;justify-content:center;padding:0.5rem 0.75rem;border:1px solid "+bd+";border-radius:4px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:0.8rem;background:"+bg+";color:"+fg;
  function a(href,text){var l=d.createElement("a");l.href=href;l.textContent=text;l.style.cssText="color:"+ac+";text-decoration:none";l.onmouseover=function(){l.style.textDecoration="underline"};l.onmouseout=function(){l.style.textDecoration="none"};return l}
  w.appendChild(a(b+"/prev/"+slug,"\\u2190 prev"));
  w.appendChild(a(b,"\\ud83c\\udf41 webring.ca"));
  w.appendChild(a(b+"/next/"+slug,"next \\u2192"));
  s.appendChild(w);
})();`

app.get('/embed.js', (c) => {
  c.header('Content-Type', 'application/javascript')
  c.header('Cache-Control', 'public, max-age=3600')
  c.header('Access-Control-Allow-Origin', '*')
  return c.body(EMBED_JS)
})

export default app
