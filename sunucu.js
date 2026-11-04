const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC = path.join(__dirname, "public");
const TURLER = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const sunucu = http.createServer((req, res) => {
  console.log(req.method, req.url);

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const yol = url.pathname;

  
  const dosya = path.join(PUBLIC, yol === "/" ? "index.html" : yol);

  if(!dosya.startsWith(PUBLIC)){
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8"});
        res.end("Sayfa bulunamadı");
        return;
  }



  fs.readFile(dosya, (hata, icerik) => {
    if(hata){
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8"});
        res.end("Sayfa bulunamadı");
        return;
    }
    const uzanti = path.extname(dosya);
    const tur = TURLER[uzanti] || "text/plain; charset=utf-8";
    res.writeHead(200,{"Content-Type": tur });
    res.end(icerik);

  });
});

sunucu.listen(PORT, () => console.log(`Sunucu: http://localhost:${PORT}`));