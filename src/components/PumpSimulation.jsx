import "../styles/pump.css";
import { TEKANAN_SKALA } from "../config";

// Gambar pompa + pipa + pressure gauge. Animasi ada di styles/pump.css
export default function PumpSimulation({ nyala, alarm, tekanan }) {
  const warnaMotor = alarm ? "#b91c1c" : nyala ? "#15803d" : "#78716c";
  // jarum gauge: -120° (0 bar) sampai +120° (skala penuh)
  const sudut = -120 + (Math.min(tekanan, TEKANAN_SKALA) / TEKANAN_SKALA) * 240;

  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      role="img"
      aria-label="Simulasi pompa"
    >
      <g transform="translate(0,45)">
        {/* pipa masuk & keluar */}
        <rect x="0" y="150" width="160" height="30" fill="#1e4fa3" />
        <rect x="195" y="40" width="30" height="75" fill="#1e4fa3" />
        <rect x="195" y="40" width="205" height="30" fill="#1e4fa3" />
        {/* air mengalir */}
        {nyala && (
          <>
            <path className="pump-water" d="M0,165 H160" />
            <path className="pump-water" d="M210,115 V55 H400" />
          </>
        )}
        <text x="8" y="196" fontSize="12" fill="#57534e">
          IN
        </text>
        <text x="350" y="92" fontSize="12" fill="#57534e">
          OUT
        </text>

        {/* pressure gauge */}
        <rect x="316" y="10" width="8" height="30" fill="#44403c" />
        <circle
          cx="320"
          cy="0"
          r="24"
          fill="#fafaf9"
          stroke="#44403c"
          strokeWidth="3"
        />
        <text x="320" y="16" fontSize="9" textAnchor="middle" fill="#57534e">
          bar
        </text>
        <g
          className="pump-needle"
          style={{
            transform: `rotate(${sudut}deg)`,
            transformOrigin: "320px 0px",
          }}
        >
          <line
            x1="320"
            y1="0"
            x2="320"
            y2="-18"
            stroke="#dc2626"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <circle cx="320" cy="0" r="3" fill="#292524" />

        {/* dudukan */}
        <rect x="140" y="225" width="220" height="14" rx="3" fill="#44403c" />

        {/* motor */}
        <g className={nyala ? "pump-motor-on" : ""}>
          <rect
            x="262"
            y="138"
            width="80"
            height="54"
            rx="6"
            fill={warnaMotor}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={272 + i * 14}
              y="143"
              width="6"
              height="44"
              fill="#00000030"
            />
          ))}
        </g>

        {/* rumah pompa */}
        <g className={alarm ? "pump-alarm" : ""}>
          <circle
            cx="210"
            cy="165"
            r="56"
            fill="#b8892e"
            stroke="#7c5a14"
            strokeWidth="5"
          />
        </g>
        <circle cx="210" cy="165" r="42" fill="#fef3c7" />

        {/* baling-baling */}
        <g className={nyala ? "pump-impeller" : ""}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <rect
              key={a}
              x="207.5"
              y="127"
              width="5"
              height="38"
              fill="#1e4fa3"
              transform={`rotate(${a} 210 165)`}
            />
          ))}
        </g>
        <circle cx="210" cy="165" r="7" fill="#292524" />
      </g>
    </svg>
  );
}
