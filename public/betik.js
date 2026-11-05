let etkinlikler= [];

const kartlarKutusu = document.getElementById("kartlar");
const durum = document.getElementById("durum");

const TUR_ADLARI = { atolye :"Atölye",topluluk:"Topluluk", soylesi:"Söyleşi"};

function kartOluştur(e){
    const kart = document.createElement("article");
    kart.className= "kart";

    const etiket = document.createElement("span");
    etiket.className = "etiket";
    etiket.textContent = TUR_ADLARI[e.tur];

    const baslik = document.createElement("h2");
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

let secilenTur ="hepsi"
let aramaMetni ="";

const dugmeler= document.querySelectorAll(".filtre");
const aramaKutusu = document.getElementById("arama");

function filtreleOlustur(){
    const sonuc = etkinlikler.filter(e => {
        const turUygun = secilenTur === "hepsi" || e.tur === secilenTur;
        const aramaUygun = e.baslik.toLocaleLowerCase("tr-TR").includes(aramaMetni);
        return turUygun && aramaUygun;
    });
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

async function etkinlikleriGetir() {
    durum.textContent = "Yükleniyor...";
    try {
        const yanit =await fetch("/api/etkinlikler");
        if (!yanit.ok) {
            throw new Error("Sunucu hatası: " + yanit.status);
        }
        etkinlikler = await yanit.json();
        filtreleOlustur();
    } catch(hata) {
        console.error(hata);
        durum.textContent = "Etkinlikler yüklenemedi. Lütfen daha sonra tekrar deneyin.";
    }
}

etkinlikleriGetir();

const form = document.getElementById("oneri-formu");
const formMesaj = document.getElementById("form-mesaj");

form.addEventListener("submit", (olay) => {
    olay.preventDefault(); 

    const ad = document.getElementById("ad").value.trim();
    const tarih = document.getElementById("tarih").value;
    const eposta = document.getElementById("eposta").value.trim();

    const hatalar = [];

    if (ad.length < 5) {
        hatalar.push("Etkinlik adı en az 5 karakter olmalı.");
    }

    const bugun = new Date().toISOString().slice(0, 10); 
    if (tarih === "") {
        hatalar.push("Tarih boş bırakılamaz.");
    } else if (tarih < bugun) {
        hatalar.push("Tarih geçmiş bir gün olamaz.");
    }

    const epostaKalibi = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!epostaKalibi.test(eposta)) {
        hatalar.push("Geçerli bir e-posta adresi girin.");
    }

    if (hatalar.length > 0) {
        formMesaj.className = "hata";
        formMesaj.textContent = hatalar.join(" ");
    } else {
        formMesaj.className = "basari";
        formMesaj.textContent = "Öneriniz gönderilmiştir.";
        form.reset();
    }
});