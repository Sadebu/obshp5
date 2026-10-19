// Мини-игры для игры СОЦИУМ
import React, { useState, useCallback } from 'react';

interface MiniGameProps {
  onComplete: (score: number) => void;
}

// Мини-игра 1: Паутина общества
export const WebOfSociety: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [connections, setConnections] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const nodes = ['Человек', 'Группа', 'Институт', 'Сфера жизни', 'Норма', 'Ценность', 'Символ'];
  const validConnections = [
    'Человек-Группа', 'Группа-Институт', 'Институт-Сфера жизни',
    'Сфера жизни-Норма', 'Норма-Ценность', 'Ценность-Символ',
    'Человек-Институт', 'Группа-Норма', 'Институт-Ценность'
  ];

  const handleNodeClick = (node: string) => {
    if (!selected) {
      setSelected(node);
    } else if (selected !== node) {
      const conn1 = `${selected}-${node}`;
      const conn2 = `${node}-${selected}`;
      if ((validConnections.includes(conn1) || validConnections.includes(conn2)) && 
          !connections.includes(conn1) && !connections.includes(conn2)) {
        setConnections([...connections, conn1]);
      }
      setSelected(null);
    } else {
      setSelected(null);
    }
  };

  const isComplete = connections.length >= 5;

  return (
    <div className="minigame-container">
      <h3>🕸️ Паутина общества</h3>
      <p className="minigame-desc">Соедини элементы общества. Нажми на два связанных элемента, чтобы создать связь. Нужно минимум 5 связей.</p>
      <div className="web-game">
        <div className="web-nodes">
          {nodes.map((node, i) => (
            <button
              key={node}
              className={`web-node ${selected === node ? 'selected' : ''} ${connections.some(c => c.includes(node)) ? 'connected' : ''}`}
              style={{
                left: `${50 + 40 * Math.cos(i * 2 * Math.PI / 7)}%`,
                top: `${50 + 40 * Math.sin(i * 2 * Math.PI / 7)}%`,
              }}
              onClick={() => handleNodeClick(node)}
            >
              {node}
            </button>
          ))}
        </div>
        <div className="web-info">
          <p>Связей создано: {connections.length}/5</p>
          {connections.map((c, i) => <p key={i} className="connection-item">✓ {c.replace('-', ' ↔ ')}</p>)}
        </div>
      </div>
      {isComplete && (
        <button className="btn-primary" onClick={() => onComplete(Math.min(connections.length * 20, 100))}>
          Завершить ✓
        </button>
      )}
    </div>
  );
};

// Мини-игра 2: Социальная пирамида
export const SocialPyramid: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const people = [
    { name: 'Топ-менеджер', correct: 'Элита', criteria: 'власть, доход' },
    { name: 'Врач в клинике', correct: 'Средний слой', criteria: 'образование, престиж' },
    { name: 'Рабочий завода', correct: 'Низший слой', criteria: 'доход' },
    { name: 'Студент-стажёр', correct: 'Низший слой', criteria: 'доход, образование' },
    { name: 'Депутат', correct: 'Элита', criteria: 'власть, престиж' },
    { name: 'Предприниматель', correct: 'Высший слой', criteria: 'доход, власть' },
  ];
  const layers = ['Элита', 'Высший слой', 'Средний слой', 'Низший слой'];

  const handleDrop = (person: string, layer: string) => {
    setPlaced({ ...placed, [person]: layer });
  };

  const score = Object.entries(placed).filter(([p, l]) => {
    const person = people.find(pp => pp.name === p);
    return person && person.correct === l;
  }).length;

  const allPlaced = Object.keys(placed).length === people.length;

  return (
    <div className="minigame-container">
      <h3>🔺 Социальная пирамида</h3>
      <p className="minigame-desc">Распредели людей по слоям общества. Нажми на человека, затем на слой.</p>
      <div className="pyramid-game">
        <div className="people-list">
          {people.map(p => (
            <button
              key={p.name}
              className={`person-card ${placed[p.name] ? 'placed' : ''}`}
              onClick={() => {
                const layerOptions = layers;
                const currentLayer = placed[p.name];
                const idx = layerOptions.indexOf(currentLayer || '');
                const nextLayer = layerOptions[(idx + 1) % layerOptions.length];
                handleDrop(p.name, currentLayer ? (idx === layerOptions.length - 1 ? '' : nextLayer) : layerOptions[0]);
              }}
            >
              <span>{p.name}</span>
              {placed[p.name] && <span className="layer-badge">{placed[p.name]}</span>}
              <span className="criteria-hint">{p.criteria}</span>
            </button>
          ))}
        </div>
        <div className="pyramid-layers">
          {layers.map((layer, i) => (
            <div key={layer} className={`pyramid-layer layer-${i}`}>
              <span>{layer}</span>
            </div>
          ))}
        </div>
      </div>
      {allPlaced && (
        <div>
          <p className="score-text">Правильно: {score}/{people.length}</p>
          <button className="btn-primary" onClick={() => onComplete(Math.round(score / people.length * 100))}>
            Завершить ✓
          </button>
        </div>
      )}
    </div>
  );
};

// Мини-игра 3: Социальный лифт
export const SocialElevator: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [score, setScore] = useState(0);
  const floors = [
    { name: 'Старт', options: ['Бросить школу', 'Учиться в университете', 'Работать без квалификации'], correct: 1, lift: true },
    { name: 'Образование', options: ['Бросить учёбу', 'Получить диплом с отличием', 'Отчислиться'], correct: 1, lift: true },
    { name: 'Карьера', options: ['Менять работу каждый месяц', 'Стать экспертом в своей области', 'Не развиваться'], correct: 1, lift: true },
    { name: 'Брак', options: ['Создать семью с поддержкой', 'Одиночество', 'Брак по расчёту'], correct: 0, lift: true },
    { name: 'Бизнес', options: ['Рискованный бизнес без плана', 'Социальное предприятие', 'Криминал'], correct: 1, lift: true },
    { name: 'Вершина', options: ['Признание в обществе', 'Изоляция', 'Потеря всего'], correct: 0, lift: true },
  ];

  const handleChoice = (optionIdx: number) => {
    const floor = floors[currentFloor];
    if (optionIdx === floor.correct) {
      setScore(score + (100 / floors.length));
    }
    if (currentFloor < floors.length - 1) {
      setCurrentFloor(currentFloor + 1);
    }
  };

  const isComplete = currentFloor >= floors.length - 1 && score > 0;

  return (
    <div className="minigame-container">
      <h3>🏢 Социальный лифт</h3>
      <p className="minigame-desc">Поднимайся по этажам общества, выбирая правильные каналы мобильности.</p>
      <div className="elevator-game">
        <div className="elevator-floors">
          {floors.map((f, i) => (
            <div key={i} className={`floor-indicator ${i === currentFloor ? 'active' : ''} ${i < currentFloor ? 'passed' : ''}`}>
              <span>{f.name}</span>
            </div>
          ))}
        </div>
        <div className="elevator-choice">
          <h4>Этаж: {floors[currentFloor]?.name}</h4>
          {floors[currentFloor]?.options.map((opt, i) => (
            <button key={i} className="elevator-option" onClick={() => handleChoice(i)}>
              {opt}
              {floors[currentFloor]?.lift && <span className="lift-badge">🛗 лифт</span>}
            </button>
          ))}
        </div>
      </div>
      {isComplete && (
        <button className="btn-primary" onClick={() => onComplete(Math.round(score))}>
          Завершить ✓
        </button>
      )}
    </div>
  );
};

// Мини-игра 4: География мобильности
export const GeographyMobility: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const questions = [
    { situation: 'Переезд из села в город для работы', answer: 'Географическая + восходящая', options: ['Горизонтальная', 'Географическая + восходящая', 'Структурная', 'Нисходящая'] },
    { situation: 'Смена работы на аналогичную в другом городе', answer: 'Горизонтальная + географическая', options: ['Вертикальная', 'Горизонтальная + географическая', 'Структурная', 'Индивидуальная'] },
    { situation: 'Закрытие завода — все рабочие теряют jobs', answer: 'Структурная', options: ['Индивидуальная', 'Географическая', 'Структурная', 'Восходящая'] },
    { situation: 'Понижение в должности', answer: 'Нисходящая вертикальная', options: ['Нисходящая вертикальная', 'Горизонтальная', 'Географическая', 'Структурная'] },
    { situation: 'Получение повышения', answer: 'Восходящая вертикальная', options: ['Горизонтальная', 'Восходящая вертикальная', 'Географическая', 'Структурная'] },
  ];

  const handleAnswer = (idx: number) => {
    if (questions[currentQ].options[idx] === questions[currentQ].answer) {
      setScore(score + 20);
    }
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const isComplete = currentQ >= questions.length - 1;

  return (
    <div className="minigame-container">
      <h3>🗺️ География мобильности</h3>
      <p className="minigame-desc">Определи тип мобильности для каждой ситуации.</p>
      <div className="geo-game">
        <div className="geo-situation">
          <p className="situation-text">«{questions[currentQ].situation}»</p>
          <div className="geo-options">
            {questions[currentQ].options.map((opt, i) => (
              <button key={i} className="geo-option" onClick={() => handleAnswer(i)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <p className="question-counter">Вопрос {currentQ + 1}/{questions.length}</p>
      </div>
      {isComplete && (
        <button className="btn-primary" onClick={() => onComplete(score)}>
          Завершить ✓
        </button>
      )}
    </div>
  );
};

// Мини-игра 5: Конфликтный узел
export const ConflictKnot: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const questions = [
    {
      situation: 'Соседи ссорятся из-за шума. Один недавно потерял работу и в депрессии.',
      cause: 'Стресс и социальное неравенство',
      excuse: 'Громкая музыка',
      options: { cause: ['Стресс и социальное неравенство', 'Громкая музыка', 'Плохая звукоизоляция'], excuse: ['Громкая музыка', 'Стресс', 'Плохой характер'] }
    },
    {
      situation: 'Коллеги конфликтуют из-за проекта. Один чувствует, что его идеи не ценят.',
      cause: 'Неравное признание вклада',
      excuse: 'Спор о деталях проекта',
      options: { cause: ['Неравное признание вклада', 'Спор о деталях', 'Личная неприязнь'], excuse: ['Спор о деталях проекта', 'Неравное признание', 'Разные характеры'] }
    },
    {
      situation: 'Рабочие требуют повышения зарплат. Предприятие убыточное из-за кризиса.',
      cause: 'Экономический кризис и снижение уровня жизни',
      excuse: 'Отказ директора повысить зарплату',
      options: { cause: ['Экономический кризис', 'Отказ директора', 'Жадность рабочих'], excuse: ['Отказ директора повысить зарплату', 'Кризис', 'Профсоюз'] }
    },
  ];

  const handleCause = (idx: number) => {
    if (questions[currentQ].options.cause[idx] === questions[currentQ].cause) setScore(score + 17);
  };
  const handleExcuse = (idx: number) => {
    if (questions[currentQ].options.excuse[idx] === questions[currentQ].excuse) setScore(score + 17);
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const isComplete = currentQ >= questions.length - 1;

  return (
    <div className="minigame-container">
      <h3>🔗 Конфликтный узел</h3>
      <p className="minigame-desc">Определи: что причина, а что — повод конфликта.</p>
      <div className="conflict-game">
        <p className="conflict-situation">«{questions[currentQ].situation}»</p>
        <div className="conflict-choices">
          <div className="conflict-section">
            <h4>🔍 Причина (глубинное противоречие):</h4>
            {questions[currentQ].options.cause.map((opt, i) => (
              <button key={i} className="conflict-option cause" onClick={() => handleCause(i)}>
                {opt}
              </button>
            ))}
          </div>
          <div className="conflict-section">
            <h4>⚡ Повод (формальный триггер):</h4>
            {questions[currentQ].options.excuse.map((opt, i) => (
              <button key={i} className="conflict-option excuse" onClick={() => handleExcuse(i)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isComplete && (
        <button className="btn-primary" onClick={() => onComplete(Math.min(score, 100))}>
          Завершить ✓
        </button>
      )}
    </div>
  );
};

// Мини-игра 6: Эскалация и деэскалация
export const Escalation: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const stages = [
    {
      name: 'Конфликтная ситуация',
      desc: 'Напряжение растёт, но открытого столкновения ещё нет.',
      actions: ['Проигнорировать', 'Поговорить заранее', 'Собрать информацию'],
      correct: 1,
    },
    {
      name: 'Инцидент',
      desc: 'Произошло событие, запускающее открытый конфликт.',
      actions: ['Ответить агрессией', 'Зафиксировать факт', 'Попытаться договориться'],
      correct: 2,
    },
    {
      name: 'Эскалация',
      desc: 'Конфликт разрастается, стороны занимают жёсткие позиции.',
      actions: ['Привлечь третью сторону (медиатора)', 'Усилить давление', 'Уйти из конфликта'],
      correct: 0,
    },
    {
      name: 'Переговоры',
      desc: 'Стороны готовы обсуждать условия.',
      actions: ['Выдвинуть ультиматум', 'Искать взаимовыгодное решение', 'Прекратить общение'],
      correct: 1,
    },
    {
      name: 'Разрешение',
      desc: 'Конфликт завершается.',
      actions: ['Компромисс', 'Победа одной стороны', 'Затягивание'],
      correct: 0,
    },
  ];

  const handleAction = (idx: number) => {
    if (idx === stages[step].correct) setScore(score + 20);
    if (step < stages.length - 1) setStep(step + 1);
  };

  const isComplete = step >= stages.length - 1;

  return (
    <div className="minigame-container">
      <h3>📈 Эскалация и деэскалация</h3>
      <p className="minigame-desc">Выбери действия, которые снижают конфликт на каждом этапе.</p>
      <div className="escalation-game">
        <div className="escalation-stages">
          {stages.map((s, i) => (
            <div key={i} className={`stage-dot ${i === step ? 'active' : ''} ${i < step ? 'passed' : ''}`}>
              {i + 1}
            </div>
          ))}
        </div>
        <div className="escalation-current">
          <h4>Этап: {stages[step].name}</h4>
          <p>{stages[step].desc}</p>
          <div className="escalation-actions">
            {stages[step].actions.map((action, i) => (
              <button key={i} className="escalation-action" onClick={() => handleAction(i)}>
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isComplete && (
        <button className="btn-primary" onClick={() => onComplete(score)}>
          Завершить ✓
        </button>
      )}
    </div>
  );
};

// Мини-игра 7: Институциональный пазл
export const InstitutionalPuzzle: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const questions = [
    { situation: 'Рождение ребёнка, регистрация брака', correct: 'Семья', options: ['Семья', 'Образование', 'Политика', 'Экономика'] },
    { situation: 'Поступление в университет, получение диплома', correct: 'Образование', options: ['Семья', 'Образование', 'Право', 'Религия'] },
    { situation: 'Покупка товара, оплата услуг', correct: 'Экономика', options: ['Экономика', 'Политика', 'Культура', 'Семья'] },
    { situation: 'Выборы президента, голосование', correct: 'Политика', options: ['Право', 'Политика', 'Экономика', 'Культура'] },
    { situation: 'Суд, защита прав в суде', correct: 'Право', options: ['Политика', 'Право', 'Религия', 'Экономика'] },
    { situation: 'Лечение в больнице, вакцинация', correct: 'Здравоохранение', options: ['Семья', 'Здравоохранение', 'Экономика', 'Культура'] },
    { situation: 'Посещение храма, религиозный обряд', correct: 'Религия', options: ['Культура', 'Религия', 'Семья', 'Политика'] },
    { situation: 'Посещение музея, театра, концерта', correct: 'Культура', options: ['Религия', 'Образование', 'Культура', 'Политика'] },
  ];

  const handleAnswer = (idx: number) => {
    if (questions[currentQ].options[idx] === questions[currentQ].correct) setScore(score + Math.round(100 / questions.length));
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const isComplete = currentQ >= questions.length - 1;

  return (
    <div className="minigame-container">
      <h3>🏛️ Институциональный пазл</h3>
      <p className="minigame-desc">Определи, к какому социальному институту относится ситуация.</p>
      <div className="puzzle-game">
        <p className="puzzle-situation">«{questions[currentQ].situation}»</p>
        <div className="puzzle-options">
          {questions[currentQ].options.map((opt, i) => (
            <button key={i} className="puzzle-option" onClick={() => handleAnswer(i)}>
              {opt}
            </button>
          ))}
        </div>
        <p className="question-counter">Вопрос {currentQ + 1}/{questions.length}</p>
      </div>
      {isComplete && (
        <button className="btn-primary" onClick={() => onComplete(score)}>
          Завершить ✓
        </button>
      )}
    </div>
  );
};

// Компонент-обёртка для выбора мини-игры
export const MiniGameWrapper: React.FC<{gameId: string; onComplete: (score: number) => void}> = ({gameId, onComplete}) => {
  switch(gameId) {
    case 'web_of_society': return <WebOfSociety onComplete={onComplete}/>;
    case 'social_pyramid': return <SocialPyramid onComplete={onComplete}/>;
    case 'social_elevator': return <SocialElevator onComplete={onComplete}/>;
    case 'geography_mobility': return <GeographyMobility onComplete={onComplete}/>;
    case 'conflict_knot': return <ConflictKnot onComplete={onComplete}/>;
    case 'escalation': return <Escalation onComplete={onComplete}/>;
    case 'institutional_puzzle': return <InstitutionalPuzzle onComplete={onComplete}/>;
    default: return <div>Мини-игра не найдена</div>;
  }
};
