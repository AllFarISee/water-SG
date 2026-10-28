import { useState, useEffect, useRef } from "react";
import { bacaFlowmeter } from "../services/flowmeter";
import {
  BATAS_HARIAN,
  BATAS_PERINGATAN,
  JAM_RESET,
  TOTALIZER_AWAL,
  KECEPATAN_SIMULASI,
  TEKANAN_MIN,
  TEKANAN_MAX,
} from "../config";

const hariOperasional = () =>
  new Date(Date.now() - JAM_RESET * 3600 * 1000).toDateString();
export default function useFlowmeter() {
  const [totalizer, setTotalizer] = useState(TOTALIZER_AWAL);
  const [baseline, setBaseline] = useState(TOTALIZER_AWAL);
  const [pompaNyala, setPompaNyala] = useState(true);
  const [debit, setDebit] = useState(0);
  const [tekanan, setTekanan] = useState(0);
  const [statusTekanan, setStatusTekanan] = useState("normal");
  const [alarm, setAlarm] = useState(false);
  const [senyap, setSenyap] = useState(false);
  const [riwayat, setRiwayat] = useState([]); 
  const [logAlarm, setLogAlarm] = useState([]);

  const totalRef = useRef(TOTALIZER_AWAL);
  const hariRef = useRef(hariOperasional());
  const audioRef = useRef(null);

  const pemakaian = totalizer - baseline;
  const waspada = pemakaian >= BATAS_PERINGATAN && pemakaian < BATAS_HARIAN;

  // jenis: "kritis" | "peringatan" | "info"
  const catat = (jenis, pesan) =>
    setLogAlarm((l) => [{ t: Date.now(), jenis, pesan }, ...l].slice(0, 100));

  // 1) Baca flowmeter tiap 1 detik
  useEffect(() => {
    const timer = setInterval(() => {
      const data = bacaFlowmeter(pompaNyala);
      totalRef.current += (data.debit * KECEPATAN_SIMULASI) / 3600; // m³/jam -> m³ per detik

      // jam 08:00: baseline = meteran saat itu (meteran asli tidak disentuh)
      const hari = hariOperasional();
      if (hari !== hariRef.current) {
        hariRef.current = hari;
        setBaseline(totalRef.current);
        setAlarm(false);
        catat(
          "info",
          `Reset harian jam ${String(JAM_RESET).padStart(2, "0")}:00: hitungan dimulai dari 0 m³, pompa bisa dinyalakan lagi`,
        );
      }

      setTotalizer(totalRef.current);
      setDebit(data.debit);
      setTekanan(data.tekanan);
      setStatusTekanan(
        !pompaNyala
          ? "normal"
          : data.tekanan < TEKANAN_MIN
            ? "low"
            : data.tekanan > TEKANAN_MAX
              ? "high"
              : "normal",
      );
      setRiwayat((r) => [
        ...r.slice(-3599),
        { t: Date.now(), debit: data.debit, tekanan: data.tekanan },
      ]);
    }, 1000);
    return () => clearInterval(timer);
  }, [pompaNyala]);

  // 2) Batas tercapai -> pompa mati + alarm
  useEffect(() => {
    if (pemakaian >= BATAS_HARIAN && pompaNyala) {
      setPompaNyala(false);
      setAlarm(true);
      setSenyap(false);
      catat(
        "danger",
        `Daily limit ${BATAS_HARIAN} m³ reached (${pemakaian.toFixed(2)} m³). Pump off Automatically`,
      );
    }
  }, [pemakaian, pompaNyala]);

  // 3) Catat peringatan mendekati batas & tekanan abnormal
  useEffect(() => {
    if (waspada)
      catat(
        "warning",
        `Usage reach out ${BATAS_PERINGATAN} m³ (limit ${BATAS_HARIAN} m³)`,
      );
  }, [waspada]);
  useEffect(() => {
    if (statusTekanan !== "normal")
      catat(
        "warning",
        `Pressure ${statusTekanan} (Spec ${TEKANAN_MIN}–${TEKANAN_MAX} bar)`,
      );
  }, [statusTekanan]);

  // 4) Bunyi beep selama alarm aktif
  useEffect(() => {
    if (!alarm || senyap) return;
    const beep = setInterval(() => {
      audioRef.current = audioRef.current || new AudioContext();
      const osc = audioRef.current.createOscillator();
      osc.frequency.value = 880;
      osc.connect(audioRef.current.destination);
      osc.start();
      osc.stop(audioRef.current.currentTime + 0.3);
    }, 700);
    return () => clearInterval(beep);
  }, [alarm, senyap]);

  // ----- Aksi -----
  const nyalakan = () => {
    if (pemakaian < BATAS_HARIAN) setPompaNyala(true);
  };
  const matikan = () => setPompaNyala(false);

  return {
    totalizer,
    baseline,
    pemakaian,
    pompaNyala,
    debit,
    tekanan,
    statusTekanan,
    waspada,
    alarm,
    senyap,
    setSenyap,
    riwayat,
    logAlarm,
    nyalakan,
    matikan,
  };
}
