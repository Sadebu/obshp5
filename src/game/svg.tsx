// SVG иллюстрации для игры
import React from 'react';

export const SVGIllustrations: Record<string, React.FC<{className?: string}>> = {
  city: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a4e"/>
          <stop offset="100%" stopColor="#4a2c7a"/>
        </linearGradient>
        <linearGradient id="bld1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d3561"/>
          <stop offset="100%" stopColor="#1a1a3e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#sky)"/>
      {/* Buildings */}
      <rect x="20" y="80" width="40" height="120" fill="#2d3561" rx="2"/>
      <rect x="25" y="85" width="8" height="8" fill="#ffd700" opacity="0.7"/>
      <rect x="37" y="85" width="8" height="8" fill="#ffd700" opacity="0.5"/>
      <rect x="25" y="100" width="8" height="8" fill="#ffd700" opacity="0.6"/>
      <rect x="37" y="100" width="8" height="8" fill="#ffd700" opacity="0.8"/>
      <rect x="25" y="115" width="8" height="8" fill="#ffd700" opacity="0.4"/>
      <rect x="37" y="115" width="8" height="8" fill="#ffd700" opacity="0.7"/>
      <rect x="70" y="60" width="50" height="140" fill="#3d4571" rx="2"/>
      <rect x="75" y="65" width="10" height="10" fill="#00d4aa" opacity="0.6"/>
      <rect x="90" y="65" width="10" height="10" fill="#00d4aa" opacity="0.8"/>
      <rect x="105" y="65" width="10" height="10" fill="#00d4aa" opacity="0.5"/>
      <rect x="75" y="80" width="10" height="10" fill="#00d4aa" opacity="0.7"/>
      <rect x="90" y="80" width="10" height="10" fill="#00d4aa" opacity="0.4"/>
      <rect x="105" y="80" width="10" height="10" fill="#00d4aa" opacity="0.9"/>
      <rect x="130" y="100" width="35" height="100" fill="#4a3570" rx="2"/>
      <rect x="175" y="50" width="60" height="150" fill="#2d4561" rx="3"/>
      <rect x="180" y="55" width="12" height="12" fill="#ff6b6b" opacity="0.6"/>
      <rect x="197" y="55" width="12" height="12" fill="#ff6b6b" opacity="0.8"/>
      <rect x="214" y="55" width="12" height="12" fill="#ff6b6b" opacity="0.5"/>
      <rect x="180" y="72" width="12" height="12" fill="#ff6b6b" opacity="0.7"/>
      <rect x="197" y="72" width="12" height="12" fill="#ff6b6b" opacity="0.9"/>
      <rect x="214" y="72" width="12" height="12" fill="#ff6b6b" opacity="0.4"/>
      <rect x="245" y="90" width="45" height="110" fill="#3d5571" rx="2"/>
      <rect x="300" y="70" width="55" height="130" fill="#4a4570" rx="2"/>
      <rect x="365" y="110" width="35" height="90" fill="#2d3561" rx="2"/>
      {/* Stars */}
      <circle cx="50" cy="20" r="1.5" fill="#fff" opacity="0.8"/>
      <circle cx="150" cy="15" r="1" fill="#fff" opacity="0.6"/>
      <circle cx="250" cy="25" r="1.5" fill="#fff" opacity="0.7"/>
      <circle cx="350" cy="18" r="1" fill="#fff" opacity="0.9"/>
      <circle cx="320" cy="35" r="1" fill="#fff" opacity="0.5"/>
      {/* Label */}
      <text x="200" y="195" textAnchor="middle" fill="#00d4aa" fontSize="10" fontFamily="sans-serif">Город Социум</text>
    </svg>
  ),
  school: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="schoolBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#2d1b4e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#schoolBg)"/>
      {/* School building */}
      <rect x="80" y="60" width="240" height="120" fill="#3d5a80" rx="4"/>
      <rect x="170" y="40" width="60" height="30" fill="#4a6fa5" rx="2"/>
      {/* Windows */}
      {[0,1,2,3,4].map(i => (
        <React.Fragment key={i}>
          <rect x={100+i*45} y="80" width="20" height="25" fill="#ffd700" opacity="0.7" rx="2"/>
          <rect x={100+i*45} y="120" width="20" height="25" fill="#ffd700" opacity="0.5" rx="2"/>
        </React.Fragment>
      ))}
      {/* Door */}
      <rect x="185" y="145" width="30" height="35" fill="#8B4513" rx="2"/>
      <circle cx="210" cy="163" r="2" fill="#ffd700"/>
      {/* Flag */}
      <line x1="200" y1="25" x2="200" y2="40" stroke="#fff" strokeWidth="2"/>
      <rect x="200" y="25" width="20" height="12" fill="#ff6b6b" rx="1"/>
      {/* People silhouettes */}
      <circle cx="60" cy="160" r="6" fill="#00d4aa" opacity="0.8"/>
      <rect x="56" y="166" width="8" height="14" fill="#00d4aa" opacity="0.6" rx="2"/>
      <circle cx="340" cy="155" r="6" fill="#ffd700" opacity="0.8"/>
      <rect x="336" y="161" width="8" height="14" fill="#ffd700" opacity="0.6" rx="2"/>
      <text x="200" y="195" textAnchor="middle" fill="#00d4aa" fontSize="10" fontFamily="sans-serif">Школа — социальный институт</text>
    </svg>
  ),
  family: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="familyBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d1b4e"/>
          <stop offset="100%" stopColor="#1a3a5f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#familyBg)"/>
      {/* Table */}
      <rect x="100" y="120" width="200" height="10" fill="#8B6914" rx="3"/>
      <rect x="120" y="130" width="8" height="40" fill="#6B4914"/>
      <rect x="272" y="130" width="8" height="40" fill="#6B4914"/>
      {/* People around table */}
      <circle cx="140" cy="100" r="10" fill="#ff9a76"/>
      <rect x="132" y="110" width="16" height="20" fill="#4a90d9" rx="3"/>
      <circle cx="200" cy="95" r="10" fill="#ffa07a"/>
      <rect x="192" y="105" width="16" height="20" fill="#d94a7a" rx="3"/>
      <circle cx="260" cy="100" r="10" fill="#ffcc80"/>
      <rect x="252" y="110" width="16" height="20" fill="#4ad990" rx="3"/>
      {/* Warm light */}
      <circle cx="200" cy="60" r="20" fill="#ffd700" opacity="0.3"/>
      <circle cx="200" cy="60" r="8" fill="#ffd700" opacity="0.6"/>
      {/* Heart */}
      <path d="M195 75 C195 70, 190 68, 188 72 C186 76, 195 82, 195 82 C195 82, 204 76, 202 72 C200 68, 195 70, 195 75Z" fill="#ff6b6b" opacity="0.8"/>
      <text x="200" y="195" textAnchor="middle" fill="#ffd700" fontSize="10" fontFamily="sans-serif">Семья — социальный институт</text>
    </svg>
  ),
  conflict: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="conflictBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a1a1a"/>
          <stop offset="100%" stopColor="#2d1b4e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#conflictBg)"/>
      {/* Two figures */}
      <circle cx="130" cy="90" r="15" fill="#ff6b6b"/>
      <rect x="118" y="105" width="24" height="35" fill="#ff6b6b" opacity="0.8" rx="4"/>
      <circle cx="270" cy="90" r="15" fill="#4a90d9"/>
      <rect x="258" y="105" width="24" height="35" fill="#4a90d9" opacity="0.8" rx="4"/>
      {/* Lightning between them */}
      <path d="M190 70 L200 90 L195 90 L205 110 L195 100 L200 100 L190 80Z" fill="#ffd700" opacity="0.9"/>
      <path d="M210 75 L200 95 L205 95 L195 115 L205 105 L200 105 L210 85Z" fill="#ff9500" opacity="0.7"/>
      {/* Sparks */}
      <circle cx="200" cy="90" r="3" fill="#fff" opacity="0.8"/>
      <circle cx="195" cy="85" r="1.5" fill="#ffd700" opacity="0.6"/>
      <circle cx="205" cy="95" r="1.5" fill="#ffd700" opacity="0.6"/>
      {/* Angry symbols */}
      <text x="125" y="80" fill="#fff" fontSize="12">😠</text>
      <text x="265" y="80" fill="#fff" fontSize="12">😤</text>
      <text x="200" y="195" textAnchor="middle" fill="#ff6b6b" fontSize="10" fontFamily="sans-serif">Социальный конфликт</text>
    </svg>
  ),
  negotiations: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="negBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a3a5f"/>
          <stop offset="100%" stopColor="#2d4a3f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#negBg)"/>
      {/* Table */}
      <ellipse cx="200" cy="130" rx="120" ry="30" fill="#5a4a3a" opacity="0.8"/>
      {/* Two people shaking hands */}
      <circle cx="150" cy="85" r="12" fill="#ff9a76"/>
      <rect x="140" y="97" width="20" height="28" fill="#4a90d9" rx="3"/>
      <circle cx="250" cy="85" r="12" fill="#ffa07a"/>
      <rect x="240" y="97" width="20" height="28" fill="#d94a7a" rx="3"/>
      {/* Handshake */}
      <path d="M165 110 Q185 105, 200 110 Q215 105, 235 110" stroke="#ffd700" strokeWidth="3" fill="none"/>
      {/* Scales of justice */}
      <line x1="200" y1="40" x2="200" y2="65" stroke="#ffd700" strokeWidth="2"/>
      <line x1="180" y1="50" x2="220" y2="50" stroke="#ffd700" strokeWidth="2"/>
      <path d="M175 50 L180 60 L185 50" stroke="#00d4aa" strokeWidth="1.5" fill="none"/>
      <path d="M215 50 L220 60 L225 50" stroke="#00d4aa" strokeWidth="1.5" fill="none"/>
      <text x="200" y="195" textAnchor="middle" fill="#00d4aa" fontSize="10" fontFamily="sans-serif">Переговоры и разрешение конфликта</text>
    </svg>
  ),
  network: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="netBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a4e"/>
          <stop offset="100%" stopColor="#2d1b6e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#netBg)"/>
      {/* Network nodes */}
      <circle cx="200" cy="100" r="15" fill="#00d4aa" opacity="0.8"/>
      <circle cx="120" cy="60" r="10" fill="#4a90d9" opacity="0.7"/>
      <circle cx="280" cy="60" r="10" fill="#ff6b6b" opacity="0.7"/>
      <circle cx="100" cy="140" r="10" fill="#ffd700" opacity="0.7"/>
      <circle cx="300" cy="140" r="10" fill="#d94a7a" opacity="0.7"/>
      <circle cx="200" cy="40" r="8" fill="#9b59b6" opacity="0.7"/>
      <circle cx="150" cy="160" r="8" fill="#00d4aa" opacity="0.6"/>
      <circle cx="250" cy="160" r="8" fill="#4a90d9" opacity="0.6"/>
      {/* Connections */}
      <line x1="200" y1="100" x2="120" y2="60" stroke="#00d4aa" strokeWidth="1" opacity="0.5"/>
      <line x1="200" y1="100" x2="280" y2="60" stroke="#00d4aa" strokeWidth="1" opacity="0.5"/>
      <line x1="200" y1="100" x2="100" y2="140" stroke="#00d4aa" strokeWidth="1" opacity="0.5"/>
      <line x1="200" y1="100" x2="300" y2="140" stroke="#00d4aa" strokeWidth="1" opacity="0.5"/>
      <line x1="200" y1="100" x2="200" y2="40" stroke="#00d4aa" strokeWidth="1" opacity="0.5"/>
      <line x1="120" y1="60" x2="200" y2="40" stroke="#4a90d9" strokeWidth="1" opacity="0.3"/>
      <line x1="280" y1="60" x2="200" y2="40" stroke="#ff6b6b" strokeWidth="1" opacity="0.3"/>
      <line x1="100" y1="140" x2="150" y2="160" stroke="#ffd700" strokeWidth="1" opacity="0.3"/>
      <line x1="300" y1="140" x2="250" y2="160" stroke="#d94a7a" strokeWidth="1" opacity="0.3"/>
      <line x1="120" y1="60" x2="100" y2="140" stroke="#4a90d9" strokeWidth="1" opacity="0.2"/>
      <line x1="280" y1="60" x2="300" y2="140" stroke="#ff6b6b" strokeWidth="1" opacity="0.2"/>
      {/* Labels */}
      <text x="200" y="104" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">общество</text>
      <text x="120" y="64" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="sans-serif">институт</text>
      <text x="280" y="64" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="sans-serif">группа</text>
      <text x="100" y="144" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="sans-serif">норма</text>
      <text x="300" y="144" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="sans-serif">роль</text>
      <text x="200" y="195" textAnchor="middle" fill="#00d4aa" fontSize="10" fontFamily="sans-serif">Общество как система</text>
    </svg>
  ),
  pyramid: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pyrBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a4e"/>
          <stop offset="100%" stopColor="#2d3a5f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#pyrBg)"/>
      {/* Pyramid layers */}
      <polygon points="200,30 230,60 170,60" fill="#ffd700" opacity="0.8"/>
      <polygon points="170,60 230,60 250,90 150,90" fill="#ff9500" opacity="0.7"/>
      <polygon points="150,90 250,90 270,120 130,120" fill="#ff6b6b" opacity="0.7"/>
      <polygon points="130,120 270,120 290,150 110,150" fill="#9b59b6" opacity="0.7"/>
      <polygon points="110,150 290,150 310,175 90,175" fill="#4a90d9" opacity="0.7"/>
      {/* Labels */}
      <text x="200" y="50" textAnchor="middle" fill="#1a1a4e" fontSize="7" fontFamily="sans-serif" fontWeight="bold">Элита</text>
      <text x="200" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">Высший слой</text>
      <text x="200" y="110" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">Средний слой</text>
      <text x="200" y="140" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">Низший слой</text>
      <text x="200" y="168" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">Маргиналы</text>
      <text x="200" y="195" textAnchor="middle" fill="#ffd700" fontSize="10" fontFamily="sans-serif">Социальная стратификация</text>
    </svg>
  ),
  elevator: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="elevBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3a5f"/>
          <stop offset="100%" stopColor="#1a1a4e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#elevBg)"/>
      {/* Building */}
      <rect x="150" y="20" width="100" height="160" fill="#2d3561" rx="3"/>
      {/* Floors */}
      {[0,1,2,3,4].map(i => (
        <React.Fragment key={i}>
          <rect x="155" y={30+i*30} width="90" height="25" fill="#3d4571" rx="2"/>
          <text x="200" y={47+i*30} textAnchor="middle" fill="#00d4aa" fontSize="7" fontFamily="sans-serif">
            {['Бизнес', 'Карьера', 'Брак', 'Образование', 'Старт'][i]}
          </text>
        </React.Fragment>
      ))}
      {/* Elevator */}
      <rect x="185" y="80" width="30" height="25" fill="#ffd700" opacity="0.8" rx="2"/>
      <text x="200" y="96" textAnchor="middle" fill="#1a1a4e" fontSize="8" fontFamily="sans-serif">↑</text>
      {/* Arrow */}
      <path d="M270 150 L270 50 L260 60 M270 50 L280 60" stroke="#00d4aa" strokeWidth="2" fill="none"/>
      <text x="290" y="100" fill="#00d4aa" fontSize="8" fontFamily="sans-serif">Восходящая</text>
      <text x="290" y="112" fill="#00d4aa" fontSize="8" fontFamily="sans-serif">мобильность</text>
      <text x="200" y="195" textAnchor="middle" fill="#ffd700" fontSize="10" fontFamily="sans-serif">Социальный лифт</text>
    </svg>
  ),
  migration: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="migBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d1b4e"/>
          <stop offset="100%" stopColor="#1a3a5f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#migBg)"/>
      {/* Road */}
      <path d="M0 150 Q100 130, 200 140 Q300 150, 400 120" stroke="#555" strokeWidth="20" fill="none" opacity="0.5"/>
      <path d="M0 150 Q100 130, 200 140 Q300 150, 400 120" stroke="#ffd700" strokeWidth="1" fill="none" strokeDasharray="10,10" opacity="0.7"/>
      {/* Train/bus */}
      <rect x="160" y="115" width="60" height="25" fill="#4a90d9" rx="5"/>
      <rect x="165" y="118" width="15" height="12" fill="#87CEEB" rx="2"/>
      <rect x="185" y="118" width="15" height="12" fill="#87CEEB" rx="2"/>
      <rect x="205" y="118" width="10" height="12" fill="#87CEEB" rx="2"/>
      <circle cx="175" cy="142" r="5" fill="#333"/>
      <circle cx="205" cy="142" r="5" fill="#333"/>
      {/* Person with suitcase */}
      <circle cx="80" cy="120" r="8" fill="#ff9a76"/>
      <rect x="74" y="128" width="12" height="18" fill="#4ad990" rx="2"/>
      <rect x="88" y="135" width="8" height="10" fill="#8B4513" rx="1"/>
      {/* Destination city */}
      <rect x="320" y="80" width="20" height="50" fill="#3d5a80" rx="2"/>
      <rect x="345" y="90" width="25" height="40" fill="#4a6fa5" rx="2"/>
      <rect x="375" y="100" width="15" height="30" fill="#3d5a80" rx="2"/>
      {/* Arrow */}
      <path d="M100 105 L300 95" stroke="#00d4aa" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#00d4aa"/>
        </marker>
      </defs>
      <text x="200" y="195" textAnchor="middle" fill="#00d4aa" fontSize="10" fontFamily="sans-serif">Географическая мобильность</text>
    </svg>
  ),
  work: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="workBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a2a4e"/>
          <stop offset="100%" stopColor="#2d3a5f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#workBg)"/>
      {/* Office desk */}
      <rect x="100" y="120" width="200" height="8" fill="#5a4a3a" rx="2"/>
      <rect x="120" y="128" width="8" height="30" fill="#4a3a2a"/>
      <rect x="272" y="128" width="8" height="30" fill="#4a3a2a"/>
      {/* Computer */}
      <rect x="170" y="90" width="60" height="30" fill="#333" rx="3"/>
      <rect x="175" y="93" width="50" height="22" fill="#4a90d9" rx="2"/>
      <rect x="190" y="120" width="20" height="5" fill="#555"/>
      {/* Person working */}
      <circle cx="200" cy="70" r="12" fill="#ff9a76"/>
      <rect x="190" y="82" width="20" height="25" fill="#4a90d9" rx="3"/>
      {/* Documents */}
      <rect x="130" y="108" width="20" height="12" fill="#fff" opacity="0.8" rx="1"/>
      <rect x="250" y="108" width="20" height="12" fill="#fff" opacity="0.8" rx="1"/>
      {/* Chart on wall */}
      <rect x="300" y="50" width="50" height="40" fill="#2d3561" rx="2"/>
      <path d="M310 80 L320 70 L330 75 L340 60" stroke="#00d4aa" strokeWidth="2" fill="none"/>
      <text x="200" y="195" textAnchor="middle" fill="#4a90d9" fontSize="10" fontFamily="sans-serif">Работа и карьера</text>
    </svg>
  ),
  passport: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="passBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a4e"/>
          <stop offset="100%" stopColor="#2d1b4e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#passBg)"/>
      {/* Document */}
      <rect x="100" y="20" width="200" height="160" fill="#f5f0e8" rx="5"/>
      <rect x="110" y="30" width="180" height="140" fill="#fff" rx="3" stroke="#ddd" strokeWidth="1"/>
      {/* Header */}
      <rect x="120" y="35" width="160" height="20" fill="#2d3561" rx="2"/>
      <text x="200" y="49" textAnchor="middle" fill="#ffd700" fontSize="9" fontFamily="sans-serif" fontWeight="bold">СОЦИОЛОГИЧЕСКИЙ ПАСПОРТ</text>
      {/* Lines */}
      <line x1="125" y1="65" x2="275" y2="65" stroke="#ddd" strokeWidth="1"/>
      <line x1="125" y1="80" x2="275" y2="80" stroke="#ddd" strokeWidth="1"/>
      <line x1="125" y1="95" x2="275" y2="95" stroke="#ddd" strokeWidth="1"/>
      <line x1="125" y1="110" x2="275" y2="110" stroke="#ddd" strokeWidth="1"/>
      <line x1="125" y1="125" x2="275" y2="125" stroke="#ddd" strokeWidth="1"/>
      {/* Stamp */}
      <circle cx="250" cy="140" r="15" fill="none" stroke="#ff6b6b" strokeWidth="2" opacity="0.7"/>
      <text x="250" y="144" textAnchor="middle" fill="#ff6b6b" fontSize="6" fontFamily="sans-serif" opacity="0.7">СОЦИУМ</text>
      <text x="200" y="195" textAnchor="middle" fill="#ffd700" fontSize="10" fontFamily="sans-serif">Итоговый документ</text>
    </svg>
  ),
  statuses: ({className}) => (
    <svg viewBox="0 0 400 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="statBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d1b4e"/>
          <stop offset="100%" stopColor="#1a3a5f"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#statBg)"/>
      {/* Person silhouette */}
      <circle cx="200" cy="70" r="20" fill="#4a6fa5" opacity="0.8"/>
      <rect x="180" y="90" width="40" height="50" fill="#4a6fa5" opacity="0.6" rx="5"/>
      {/* Status cards around */}
      <rect x="50" y="40" width="60" height="20" fill="#00d4aa" opacity="0.7" rx="3"/>
      <text x="80" y="54" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">гражданин</text>
      <rect x="290" y="40" width="60" height="20" fill="#ffd700" opacity="0.7" rx="3"/>
      <text x="320" y="54" textAnchor="middle" fill="#1a1a4e" fontSize="7" fontFamily="sans-serif">работник</text>
      <rect x="50" y="100" width="60" height="20" fill="#ff6b6b" opacity="0.7" rx="3"/>
      <text x="80" y="114" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">родитель</text>
      <rect x="290" y="100" width="60" height="20" fill="#9b59b6" opacity="0.7" rx="3"/>
      <text x="320" y="114" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">друг</text>
      <rect x="70" y="140" width="60" height="20" fill="#4a90d9" opacity="0.7" rx="3"/>
      <text x="100" y="154" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">супруг(а)</text>
      <rect x="270" y="140" width="60" height="20" fill="#ff9500" opacity="0.7" rx="3"/>
      <text x="300" y="154" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">лидер</text>
      {/* Lines connecting */}
      <line x1="110" y1="50" x2="180" y2="70" stroke="#00d4aa" strokeWidth="1" opacity="0.4"/>
      <line x1="290" y1="50" x2="220" y2="70" stroke="#ffd700" strokeWidth="1" opacity="0.4"/>
      <line x1="110" y1="110" x2="180" y2="90" stroke="#ff6b6b" strokeWidth="1" opacity="0.4"/>
      <line x1="290" y1="110" x2="220" y2="90" stroke="#9b59b6" strokeWidth="1" opacity="0.4"/>
      <text x="200" y="195" textAnchor="middle" fill="#00d4aa" fontSize="10" fontFamily="sans-serif">Статусный набор</text>
    </svg>
  ),
};
