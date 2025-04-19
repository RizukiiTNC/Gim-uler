let ukuranBlok = 25;
let baris = 20;
let kolom = 20;
let papan;
let konteks;

let ularX = ukuranBlok * 5;
let ularY = ukuranBlok * 5;
let tubuhUlar = [];

let kecepatanX = 0;
let kecepatanY = 0;

let gameOver = false;

let makananX = ukuranBlok * 10;
let makananY = ukuranBlok * 10;

window.onload = function () {
  papan = document.getElementById("board");
  papan.height = baris * ukuranBlok;
  papan.width = kolom * ukuranBlok;
  konteks = papan.getContext("2d");

  tempatkanMakanan();
  document.addEventListener("keyup", ubahArah);
  setInterval(perbarui, 1000 / 10);

  document.body.style.paddingBottom = "100px"; // biar tombol gak nabrak canvas
  buatKontrolSentuh();
};

function perbarui() {
  if (gameOver) return;

  konteks.fillStyle = "black";
  konteks.fillRect(0, 0, papan.width, papan.height);

  // gambar makanan
  konteks.fillStyle = "red";
  konteks.fillRect(makananX, makananY, ukuranBlok, ukuranBlok);

  // cek kalau ular makan makanan
  if (ularX === makananX && ularY === makananY) {
    tubuhUlar.push([makananX, makananY]);
    tempatkanMakanan();
  }

  // gerakkan tubuh dari belakang ke depan
  for (let i = tubuhUlar.length - 1; i > 0; i--) {
    tubuhUlar[i] = tubuhUlar[i - 1];
  }
  if (tubuhUlar.length) {
    tubuhUlar[0] = [ularX, ularY];
  }

  // update posisi ular
  ularX += kecepatanX * ukuranBlok;
  ularY += kecepatanY * ukuranBlok;

  // gambar ular
  konteks.fillStyle = "lime";
  konteks.fillRect(ularX, ularY, ukuranBlok, ukuranBlok);
  for (let i = 0; i < tubuhUlar.length; i++) {
    konteks.fillRect(tubuhUlar[i][0], tubuhUlar[i][1], ukuranBlok, ukuranBlok);
  }

  // cek tabrakan dinding
  if (
    ularX < 0 ||
    ularX >= kolom * ukuranBlok ||
    ularY < 0 ||
    ularY >= baris * ukuranBlok
  ) {
    akhirGame();
  }

  // cek tabrakan sama tubuh sendiri
  for (let i = 0; i < tubuhUlar.length; i++) {
    if (ularX === tubuhUlar[i][0] && ularY === tubuhUlar[i][1]) {
      akhirGame();
    }
  }
}

function ubahArah(e) {
  if (e.code === "ArrowUp" && kecepatanY !== 1) {
    kecepatanX = 0;
    kecepatanY = -1;
  } else if (e.code === "ArrowDown" && kecepatanY !== -1) {
    kecepatanX = 0;
    kecepatanY = 1;
  } else if (e.code === "ArrowLeft" && kecepatanX !== 1) {
    kecepatanX = -1;
    kecepatanY = 0;
  } else if (e.code === "ArrowRight" && kecepatanX !== -1) {
    kecepatanX = 1;
    kecepatanY = 0;
  }
}

function tempatkanMakanan() {
  makananX = Math.floor(Math.random() * kolom) * ukuranBlok;
  makananY = Math.floor(Math.random() * baris) * ukuranBlok;
}

function akhirGame() {
  gameOver = true;
  setTimeout(() => {
    if (confirm("Game Over! Coba lagi?")) {
      mulaiUlang();
    }
  }, 100);
}

function mulaiUlang() {
  ularX = ukuranBlok * 5;
  ularY = ukuranBlok * 5;
  kecepatanX = 0;
  kecepatanY = 0;
  tubuhUlar = [];
  gameOver = false;
  tempatkanMakanan();
}

// === Buat kontrol sentuh versi tombol panah (↑↓←→) ===
function buatKontrolSentuh() {
  const kontrol = document.createElement("div");
  kontrol.style.position = "fixed";
  kontrol.style.bottom = "10px";
  kontrol.style.left = "50%";
  kontrol.style.transform = "translateX(-50%)";
  kontrol.style.display = "grid";
  kontrol.style.gridTemplateColumns = "repeat(3, 60px)";
  kontrol.style.gap = "8px";
  kontrol.style.zIndex = "999";

  const tombol = {
    atas: () => ubahArah({ code: "ArrowUp" }),
    bawah: () => ubahArah({ code: "ArrowDown" }),
    kiri: () => ubahArah({ code: "ArrowLeft" }),
    kanan: () => ubahArah({ code: "ArrowRight" }),
  };

  const buatBtn = (label, aksi) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.width = "60px";
    btn.style.height = "50px";
    btn.style.fontSize = "20px";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.backgroundColor = "#333";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.onclick = aksi;
    return btn;
  };

  kontrol.append(
    document.createElement("div"),
    buatBtn("↑", tombol.atas),
    document.createElement("div"),
    buatBtn("←", tombol.kiri),
    buatBtn("↓", tombol.bawah),
    buatBtn("→", tombol.kanan)
  );

  document.body.appendChild(kontrol);
}
