let etkinlikler = [
  { id: 1, baslik: "Unity'e Giriş Dersi", tur: "atolye", tarih: "2026-11-20", yer: "Oyun Geliştirme Kulüp Odası", kontenjan: 40 },
  { id: 2, baslik: "Bilgisayar Mühendisliğinin Gelecekteki Konumu", tur: "soylesi", tarih: "2026-12-01", yer: "Erdoğan Akdağ Kongre Merkezi", kontenjan: 300 },
];

const kartlarKutusu = document.getElementById("kartlar");
const durum = document.getElementById("durum");

const TUR_ADLARI = { atolye :"Atölye",topluluk:"Topluluk", soylesi:"Söyleşi"};

function kartOluştur(e){
    const kart = document.createElement("article");
    kart.className= "kart";

    const etiket = document.createElement("span");
    etiket.className = "etiket";
    etiket.textContent = TUR_ADLARI[e.tur];

    const baslik = document.createElement("h3");
    baslik.textContent = e.baslik;

    const tarih = document.createElement("p");
    tarih.textContent = "📅 " + new Date(e.tarih).toLocaleDateString("tr-TR");

    const yer = document.createElement("p");
    yer.textContent = "🗺️" + e.yer;

    const kontenjan = document.createElement("p");
    kontenjan.textContent = "👤 Kontenjan: " + e.kontenjan;

    kart.append(etiket, baslik, tarih, yer, kontenjan);
    return kart;
}

function olustur(liste){
    kartlarKutusu.innerHTML = ""

    if(liste.length === 0){
        durum.textContent = ("Etkinlik bulunamadı.");
        return;
    }
    durum.textContent= "";
    for (const e of liste){
        kartlarKutusu.append(kartOluştur(e));
    }
}
olustur(etkinlikler);

let secilenTur ="hepsi"
let aramaMetni ="";

const dugmeler= document.querySelectorAll(".filtre");
const aramaKutusu = document.getElementById("arama");

function filtreleOlustur(){
    const sonuc = etkinlikler.filter(e => {
        const turUygun = secilenTur ==="hepsi" || e.tur === secilenTur;
        const aramaUygun = e.baslik.toLocaleLowerCase("tr-TR").includes(aramaMetni);
            return turUygun && aramaUygun;
        
    }  );
    olustur(sonuc);

}

for (const dugme of dugmeler){
    dugme.addEventListener("click", () => {
        for (const d of dugmeler) d.classList.remove("secilmistir");
        dugme.classList.add("secilmistir");
        secilenTur = dugme.dataset.tur;
        filtreleOlustur();
    });
}
aramaKutusu.addEventListener("input", () => {
    aramaMetni = aramaKutusu.value.trim().toLocaleLowerCase("tr-TR");
    filtreleOlustur();

});

filtreleOlustur();