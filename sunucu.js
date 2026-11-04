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
function jsonGonder(res, durum, veri){
    res.writeHead(durum, {"Content-Type": "application/json; charset=utf-8"});
    res.end(JSON.stringify(veri));
}

const sunucu = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if(req.method !== "GET"){
    res.writeHead(405, {"Content-Type": "text/plain; charset=utf-8", "ALLOW": "GET"
    });
    res.end("Bu Yönteme İzin Verilmiyor");
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const yol = url.pathname;

  if(yol.startsWith("/api/etkinlikler")){
    const etkinlikler = JSON.parse(fs.readFileSync(path.join(__dirname,"etkinlikler.json"), "utf-8"));

    if(yol === "/api/etkinlikler" ){
        const tur = url.searchParams.get("tur");
        if(tur){
            const suzulmus = etkinlikler.filter(e => e.tur === tur);
            jsonGonder(res, 200, suzulmus)
        }else{
            jsonGonder(res, 200, etkinlikler )
        }
        return;
    }

const id = Number(yol.split("/")[3]);
const etkinlik = etkinlikler.find(e => e.id === id);
if (etkinlik){
    jsonGonder (res, 200, etkinlik)
  }else{
    jsonGonder (res, 404,{hata:"Etkinlik bulunamadı"});
   }
   return;

  }

  
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