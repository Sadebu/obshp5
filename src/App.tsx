import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Resources, DEFAULT_RESOURCES, DISTRICT_BONUSES, FAMILY_BONUSES, Character } from './game/types';
import { SCENES, GLOSSARY, ACHIEVEMENTS, ENDINGS } from './game/data';
import { SVGIllustrations } from './game/svg';
import { MiniGameWrapper } from './game/minigames';
import { generateStudentCode, exportStudentProgress } from './game/teacher';
import TeacherMode from './components/TeacherMode';

// ===== INITIAL STATE =====
const createInitialState = (): GameState => ({
  character: null,
  resources: { ...DEFAULT_RESOURCES },
  currentAct: 1,
  currentScene: 'a1_s1',
  sceneHistory: [],
  flags: {},
  statuses: { prescribed: ['подросток', 'житель города Социум', 'представитель поколения Z'], achieved: [] },
  roles: ['ученик'],
  journal: [],
  achievements: [],
  conflicts: [],
  mobilityEvents: [],
  socialLifts: [],
  strata: 'Начальное положение',
  ending: null,
  textSpeed: 1,
  reducedAnimation: false,
  soundEnabled: false,
});

// ===== SAVE/LOAD =====
const saveGame = (state: GameState) => {
  try { localStorage.setItem('socicum_save', JSON.stringify(state)); } catch(e) {}
};
const loadGame = (): GameState | null => {
  try {
    const data = localStorage.getItem('socicum_save');
    return data ? JSON.parse(data) : null;
  } catch(e) { return null; }
};

// ===== DOWNLOAD HTML =====
const downloadHTML = async () => {
  try {
    // Получаем текущий HTML
    const html = document.documentElement.outerHTML;
    
    // Находим все внешние CSS и JS файлы
    const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const jsScripts = Array.from(document.querySelectorAll('script[src]'));
    
    let finalHTML = html;
    
    // Загружаем и встраиваем CSS
    for (const link of cssLinks) {
      const href = link.getAttribute('href');
      if (href) {
        try {
          const response = await fetch(href);
          const css = await response.text();
          const styleTag = `<style>${css}</style>`;
          finalHTML = finalHTML.replace(link.outerHTML, styleTag);
        } catch (e) {
          console.warn('Не удалось загрузить CSS:', href);
        }
      }
    }
    
    // Загружаем и встраиваем JS
    for (const script of jsScripts) {
      const src = script.getAttribute('src');
      if (src) {
        try {
          const response = await fetch(src);
          const js = await response.text();
          const scriptTag = `<script>${js}<\/script>`;
          finalHTML = finalHTML.replace(script.outerHTML, scriptTag);
        } catch (e) {
          console.warn('Не удалось загрузить JS:', src);
        }
      }
    }
    
    // Создаем Blob и скачиваем
    const blob = new Blob([finalHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'СОЦИУМ-игра.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Игра успешно скачана!\nОткройте файл "СОЦИУМ-игра.html" в браузере.');
  } catch (error) {
    console.error('Ошибка при скачивании:', error);
    alert('❌ Не удалось скачать файл. Попробуйте ещё раз.');
  }
};

// ===== APP COMPONENT =====
export default function App() {
  const [screen, setScreen] = useState<'start'|'creation'|'game'|'minigame'|'passport'|'ending'|'rules'|'glossary'|'settings'|'achievements'|'teacher'>('start');
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [modal, setModal] = useState<string | null>(null);
  const [achievementPopup, setAchievementPopup] = useState<{name: string; desc: string} | null>(null);
  const [currentMinigame, setCurrentMinigame] = useState<string | null>(null);

  // Auto-save
  useEffect(() => {
    if (screen === 'game' || screen === 'passport') {
      saveGame(gameState);
    }
  }, [gameState, screen]);

  // Achievement popup
  const showAchievement = useCallback((id: string) => {
    const ach = ACHIEVEMENTS[id];
    if (ach && !gameState.achievements.includes(id)) {
      setAchievementPopup(ach);
      setGameState(prev => ({ ...prev, achievements: [...prev.achievements, id] }));
      setTimeout(() => setAchievementPopup(null), 3500);
    }
  }, [gameState.achievements]);

  // Apply choice effects
  const applyChoice = (choice: any) => {
    setGameState(prev => {
      const newState = { ...prev };
      // Resources
      if (choice.effects) {
        const newResources = { ...newState.resources };
        Object.entries(choice.effects).forEach(([key, val]) => {
          newResources[key as keyof Resources] = Math.max(0, Math.min(100, newResources[key as keyof Resources] + (val as number)));
        });
        newState.resources = newResources;
      }
      // Flags
      if (choice.flags) {
        newState.flags = { ...newState.flags, ...choice.flags };
      }
      // Status
      if (choice.addStatus && !newState.statuses.achieved.includes(choice.addStatus)) {
        newState.statuses = { ...newState.statuses, achieved: [...newState.statuses.achieved, choice.addStatus] };
      }
      // Role
      if (choice.addRole && !newState.roles.includes(choice.addRole)) {
        newState.roles = [...newState.roles, choice.addRole];
      }
      // Journal
      if (choice.addJournal && !newState.journal.includes(choice.addJournal)) {
        newState.journal = [...newState.journal, choice.addJournal];
      }
      // Achievement
      if (choice.addAchievement) {
        showAchievement(choice.addAchievement);
      }
      // Conflict
      if (choice.addConflict) {
        newState.conflicts = [...newState.conflicts, { id: choice.addConflict, resolution: '' }];
      }
      // Mobility
      if (choice.addMobility && !newState.mobilityEvents.includes(choice.addMobility)) {
        newState.mobilityEvents = [...newState.mobilityEvents, choice.addMobility];
      }
      // Lift
      if (choice.addLift && !newState.socialLifts.includes(choice.addLift)) {
        newState.socialLifts = [...newState.socialLifts, choice.addLift];
      }
      // Scene history
      newState.sceneHistory = [...newState.sceneHistory, newState.currentScene];
      // Next scene
      if (choice.minigame) {
        setCurrentMinigame(choice.minigame);
        setScreen('minigame');
      } else {
        newState.currentScene = choice.next;
        // Update act
        const nextScene = SCENES.find(s => s.id === choice.next);
        if (nextScene) newState.currentAct = nextScene.act;
      }
      // Update strata
      const avg = (newState.resources.income + newState.resources.education + newState.resources.prestige + newState.resources.power) / 4;
      if (avg > 65) newState.strata = 'Высший слой';
      else if (avg > 50) newState.strata = 'Средний слой';
      else if (avg > 35) newState.strata = 'Ниже среднего';
      else newState.strata = 'Низший слой';

      return newState;
    });
  };

  // Handle minigame completion
  const handleMinigameComplete = (score: number) => {
    const scene = SCENES.find(s => s.id === gameState.currentScene);
    const choice = scene?.choices.find(c => c.minigame);
    if (choice) {
      setGameState(prev => {
        const newState = { ...prev };
        newState.sceneHistory = [...newState.sceneHistory, newState.currentScene];
        newState.currentScene = choice.next;
        const nextScene = SCENES.find(s => s.id === choice.next);
        if (nextScene) newState.currentAct = nextScene.act;
        // Bonus for good score
        const bonus = Math.round(score / 100 * 10);
        newState.resources = {
          ...newState.resources,
          education: Math.min(100, newState.resources.education + bonus),
          reputation: Math.min(100, newState.resources.reputation + Math.round(bonus / 2)),
        };
        // Save minigame score
        if (currentMinigame) {
          newState.minigameScores = {
            ...newState.minigameScores,
            [currentMinigame]: score
          };
        }
        return newState;
      });
    }
    setCurrentMinigame(null);
    setScreen('game');
  };

  // Create character
  const createCharacter = (character: Character) => {
    const districtBonus = DISTRICT_BONUSES[character.district] || {};
    const familyBonus = FAMILY_BONUSES[character.family] || {};
    const resources = { ...DEFAULT_RESOURCES };
    Object.entries(districtBonus).forEach(([k, v]) => {
      resources[k as keyof Resources] = Math.max(0, Math.min(100, resources[k as keyof Resources] + (v as number)));
    });
    Object.entries(familyBonus).forEach(([k, v]) => {
      resources[k as keyof Resources] = Math.max(0, Math.min(100, resources[k as keyof Resources] + (v as number)));
    });
    const studentCode = generateStudentCode();
    setGameState(prev => ({
      ...prev,
      character,
      resources,
      studentCode,
      minigameScores: {},
      statuses: {
        prescribed: ['подросток', 'житель города Социума', 'представитель поколения Z', `житель ${character.district}`, character.gender === 'М' ? 'сын своей семьи' : 'дочь своей семьи'],
        achieved: ['школьник'],
      },
    }));
    setScreen('game');
  };

  // Determine ending
  const determineEnding = (): string => {
    const r = gameState.resources;
    const f = { ...gameState.flags, conflictsResolved: gameState.conflicts.length };
    if (ENDINGS.architect.condition(r, f)) return 'architect';
    if (ENDINGS.ascending.condition(r, f)) return 'ascending';
    if (ENDINGS.bridge.condition(r, f)) return 'bridge';
    if (ENDINGS.systemic.condition(r, f)) return 'systemic';
    if (ENDINGS.descending.condition(r, f)) return 'descending';
    if (ENDINGS.loner.condition(r, f)) return 'loner';
    return 'stable';
  };

  // Navigate to ending
  const goToEnding = () => {
    const endingId = determineEnding();
    setGameState(prev => ({ ...prev, ending: endingId }));
    setScreen('ending');
  };

  // Reset game
  const resetGame = () => {
    setGameState(createInitialState());
    setScreen('start');
  };

  // Current scene
  const currentSceneData = SCENES.find(s => s.id === gameState.currentScene);

  // ===== RENDER =====
  return (
    <div className={gameState.reducedAnimation ? 'reduced-motion' : ''}>
      {/* Achievement popup */}
      {achievementPopup && (
        <div className="achievement-popup">
          <h4>🏆 {achievementPopup.name}</h4>
          <p>{achievementPopup.desc}</p>
        </div>
      )}

      {/* START SCREEN */}
      {screen === 'start' && (
        <div className="start-screen">
          {SVGIllustrations.network && <div className="scene-illustration" style={{maxWidth: 400, marginBottom: '2rem'}}>{React.createElement(SVGIllustrations.network, {className: ''})}</div>}
          <h1 className="game-title">СОЦИУМ</h1>
          <p className="game-subtitle">жизнь в обществе</p>
          <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 500, fontSize: '0.9rem'}}>
            Обучающая игра по обществознанию §5.<br/>
            Общество как система. Человек в системе социальных взаимодействий.
          </p>
          
          <div style={{
            background: 'rgba(139,92,246,0.1)',
            border: '2px solid var(--accent-purple)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            maxWidth: 500,
            textAlign: 'left'
          }}>
            <div style={{fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '0.5rem'}}>
              👨‍🏫 Для учителей:
            </div>
            <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5}}>
              Отслеживайте прогресс учеников, выставляйте оценки и экспортируйте отчёты через <strong>"Режим учителя"</strong>
            </div>
          </div>
          <div className="start-buttons">
            <button className="btn btn-primary" onClick={() => setScreen('creation')}>Новая игра</button>
            {loadGame() && (
              <button className="btn btn-secondary" onClick={() => {
                const saved = loadGame();
                if (saved) { setGameState(saved); setScreen('game'); }
              }}>Продолжить</button>
            )}
            <button className="btn btn-secondary" onClick={() => setScreen('rules')}>Правила</button>
            <button className="btn btn-secondary" onClick={() => setScreen('glossary')}>Глоссарий</button>
            <button className="btn btn-secondary" onClick={() => setScreen('settings')}>Настройки</button>
            <button className="btn btn-secondary" onClick={downloadHTML} style={{marginTop: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none'}}>
              📥 Скачать HTML
            </button>
            <button className="btn btn-secondary" onClick={() => setScreen('teacher')} style={{background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none'}}>
              👨‍🏫 Режим учителя
            </button>
          </div>
        </div>
      )}

      {/* RULES SCREEN */}
      {screen === 'rules' && (
        <div className="modal-overlay" onClick={() => setScreen('start')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{color: 'var(--accent-yellow)', marginBottom: '1rem'}}>📖 Правила игры</h2>
            <div style={{fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)'}}>
              <p><strong>СОЦИУМ</strong> — это сюжетная обучающая игра, в которой ты проживаешь жизнь персонажа в вымышленном городе Социум.</p>
              <br/>
              <p><strong>Как играть:</strong></p>
              <ul style={{paddingLeft: '1.5rem', margin: '0.5rem 0'}}>
                <li>Создай персонажа: выбери имя, пол, район и семью</li>
                <li>Читай сюжетные сцены и делай выбор</li>
                <li>Каждый выбор влияет на ресурсы, статусы и роли</li>
                <li>Проходи мини-игры для получения бонусов</li>
                <li>Следи за журналом — там появляются новые термины</li>
                <li>В конце игры получи «Социологический паспорт»</li>
              </ul>
              <br/>
              <p><strong>Ресурсы:</strong> доход, образование, престиж, власть, социальные связи, семейное благополучие, устойчивость, репутация.</p>
              <br/>
              <p><strong>Цель:</strong> понять, как устроено общество, через проживание жизни персонажа. Это НЕ викторина — это симулятор!</p>
              <br/>
              <p><strong>Продолжительность:</strong> 20–30 минут</p>
            </div>
            <br/>
            <button className="btn btn-primary" onClick={() => setScreen('start')}>Понятно!</button>
          </div>
        </div>
      )}

      {/* GLOSSARY SCREEN */}
      {screen === 'glossary' && (
        <div className="modal-overlay" onClick={() => setScreen('start')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{color: 'var(--accent-yellow)', marginBottom: '1rem'}}>📚 Глоссарий</h2>
            <div className="glossary-content">
              {Object.entries(GLOSSARY).map(([term, def]) => (
                <div key={term} className="glossary-item">
                  <div className="glossary-term">{term}</div>
                  <div className="glossary-def">{def}</div>
                </div>
              ))}
            </div>
            <br/>
            <button className="btn btn-primary" onClick={() => setScreen('start')}>Закрыть</button>
          </div>
        </div>
      )}

      {/* SETTINGS SCREEN */}
      {screen === 'settings' && (
        <div className="modal-overlay" onClick={() => setScreen('start')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{color: 'var(--accent-yellow)', marginBottom: '1.5rem'}}>⚙️ Настройки</h2>
            <div className="settings-group">
              <label>Скорость текста: {gameState.textSpeed === 1 ? 'Нормальная' : gameState.textSpeed === 2 ? 'Быстрая' : 'Мгновенная'}</label>
              <input type="range" min="1" max="3" value={gameState.textSpeed} onChange={e => setGameState(prev => ({...prev, textSpeed: Number(e.target.value)}))}/>
            </div>
            <div className="settings-group">
              <div className="toggle-switch" onClick={() => setGameState(prev => ({...prev, reducedAnimation: !prev.reducedAnimation}))}>
                <div className={`toggle-track ${gameState.reducedAnimation ? 'active' : ''}`}>
                  <div className="toggle-thumb"/>
                </div>
                <span>Уменьшенная анимация</span>
              </div>
            </div>
            <div className="settings-group">
              <button className="btn btn-danger btn-small" onClick={() => { localStorage.removeItem('socicum_save'); alert('Сохранения удалены'); }}>
                Удалить сохранения
              </button>
            </div>
            <br/>
            <button className="btn btn-primary" onClick={() => setScreen('start')}>Закрыть</button>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS SCREEN */}
      {screen === 'achievements' && (
        <div className="modal-overlay" onClick={() => setScreen('game')}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{color: 'var(--accent-yellow)', marginBottom: '1rem'}}>🏆 Достижения</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {Object.entries(ACHIEVEMENTS).map(([id, ach]) => (
                <div key={id} style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: gameState.achievements.includes(id) ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${gameState.achievements.includes(id) ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.1)'}`,
                  opacity: gameState.achievements.includes(id) ? 1 : 0.5,
                }}>
                  <div style={{fontWeight: 600, color: gameState.achievements.includes(id) ? 'var(--accent-yellow)' : 'var(--text-secondary)'}}>
                    {gameState.achievements.includes(id) ? '🏆' : '🔒'} {ach.name}
                  </div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{ach.desc}</div>
                </div>
              ))}
            </div>
            <br/>
            <button className="btn btn-primary" onClick={() => setScreen('game')}>Закрыть</button>
          </div>
        </div>
      )}

      {/* JOURNAL MODAL */}
      {modal === 'journal' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{color: 'var(--accent-yellow)', marginBottom: '1rem'}}>📓 Журнал событий</h2>
            <div className="journal-content">
              {gameState.journal.length === 0 ? (
                <p style={{color: 'var(--text-secondary)'}}>Журнал пока пуст. Новые термины появятся по мере игры.</p>
              ) : (
                gameState.journal.map((item, i) => (
                  <div key={i} className="journal-item">
                    <strong>{item}</strong>
                    {GLOSSARY[item] && <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem'}}>{GLOSSARY[item]}</p>}
                  </div>
                ))
              )}
            </div>
            <br/>
            <button className="btn btn-primary" onClick={() => setModal(null)}>Закрыть</button>
          </div>
        </div>
      )}

      {/* CHARACTER CREATION */}
      {screen === 'creation' && <CharacterCreation onCreate={createCharacter} onBack={() => setScreen('start')}/>}

      {/* TEACHER MODE */}
      {screen === 'teacher' && <TeacherMode onBack={() => setScreen('start')}/>}

      {/* GAME SCREEN */}
      {screen === 'game' && currentSceneData && (
        <div className="game-screen">
          {/* HUD */}
          <div className="hud">
            <div className="hud-resources">
              {([
                ['income', '💰 Доход'],
                ['education', '📚 Образование'],
                ['prestige', '⭐ Престиж'],
                ['power', '👑 Власть'],
                ['socialConnections', '🤝 Связи'],
                ['familyWellbeing', '🏠 Семья'],
                ['innerStability', '🧘 Устойчивость'],
                ['reputation', '📣 Репутация'],
              ] as [keyof Resources, string][]).map(([key, label]) => (
                <div key={key} className="resource-bar">
                  <div className="resource-label">
                    <span>{label}</span>
                    <span>{gameState.resources[key]}</span>
                  </div>
                  <div className="resource-track">
                    <div className={`resource-fill ${key}`} style={{width: `${gameState.resources[key]}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div className="status-bar">
            {gameState.studentCode && (
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--accent-purple)',
                background: 'rgba(155,89,182,0.15)',
                padding: '0.25rem 0.5rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontWeight: 600,
                marginRight: '0.5rem'
              }}>
                🎓 {gameState.studentCode}
              </span>
            )}
            <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Статусы:</span>
            {gameState.statuses.prescribed.slice(0, 3).map(s => (
              <span key={s} className="status-badge prescribed">{s}</span>
            ))}
            {gameState.statuses.achieved.slice(-3).map(s => (
              <span key={s} className="status-badge achieved">{s}</span>
            ))}
            <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem'}}>Роли:</span>
            {gameState.roles.slice(-3).map(r => (
              <span key={r} className="role-badge">{r}</span>
            ))}
          </div>

          {/* Scene */}
          <div className="scene-area">
            <div className="scene-act">Акт {currentSceneData.act} • Возраст: {gameState.character ? (currentSceneData.act === 1 ? 14 : currentSceneData.act === 2 ? 17 + Math.floor((gameState.sceneHistory.length % 10)) : 25 + Math.floor((gameState.sceneHistory.length % 7))) : 14} лет</div>
            <h2 className="scene-title">{currentSceneData.title}</h2>
            
            {/* Illustration */}
            {currentSceneData.illustration && SVGIllustrations[currentSceneData.illustration] && (
              <div className="scene-illustration">
                {React.createElement(SVGIllustrations[currentSceneData.illustration], {className: ''})}
              </div>
            )}

            <div className="scene-text">{currentSceneData.text}</div>

            {currentSceneData.conceptNote && (
              <div className="scene-concept">
                💡 {currentSceneData.conceptNote}
              </div>
            )}

            <div className="choices">
              {currentSceneData.choices.map((choice, i) => (
                <button key={i} className="choice-btn" onClick={() => {
                  if (choice.next === 'ending') {
                    goToEnding();
                  } else {
                    applyChoice(choice);
                  }
                }}>
                  {choice.text}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bottom-bar">
            <button className="btn btn-secondary btn-small" onClick={() => setModal('journal')}>📓 Журнал</button>
            <button className="btn btn-secondary btn-small" onClick={() => setScreen('glossary')}>📚 Глоссарий</button>
            <button className="btn btn-secondary btn-small" onClick={() => setScreen('achievements')}>🏆 Ачивки</button>
            <button className="btn btn-secondary btn-small" onClick={() => saveGame(gameState)}>💾 Сохранить</button>
            {gameState.studentCode && (
              <button className="btn btn-secondary btn-small" onClick={() => exportStudentProgress(gameState)} style={{background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none'}}>
                📤 Экспорт для учителя
              </button>
            )}
            <button className="btn btn-secondary btn-small" onClick={downloadHTML} style={{background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none'}}>📥 Скачать</button>
          </div>
        </div>
      )}

      {/* MINIGAME SCREEN */}
      {screen === 'minigame' && currentMinigame && (
        <div className="game-screen">
          <div className="scene-area" style={{paddingTop: '2rem'}}>
            <MiniGameWrapper gameId={currentMinigame} onComplete={handleMinigameComplete}/>
          </div>
        </div>
      )}

      {/* ENDING SCREEN */}
      {screen === 'ending' && gameState.ending && (
        <div className="ending-screen">
          {SVGIllustrations.passport && <div className="scene-illustration" style={{maxWidth: 300, marginBottom: '2rem'}}>{React.createElement(SVGIllustrations.passport, {className: ''})}</div>}
          <h1 className="ending-title">{ENDINGS[gameState.ending as keyof typeof ENDINGS]?.title}</h1>
          <p className="ending-text">{ENDINGS[gameState.ending as keyof typeof ENDINGS]?.text}</p>
          
          {/* Concepts used */}
          <div className="passport-card" style={{textAlign: 'left', maxWidth: 600}}>
            <h3 style={{color: 'var(--accent-teal)', marginBottom: '1rem'}}>📖 Какие понятия ты использовал?</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {[
                { term: 'Общество как система', desc: 'Общество — это совокупность взаимосвязанных элементов: людей, групп, институтов, которые влияют друг на друга.' },
                { term: 'Социальный институт', desc: 'Устойчивая форма организации совместной деятельности (семья, образование, государство), выполняющая важные функции.' },
                { term: 'Социальная стратификация', desc: 'Деление общества на слои по критериям: доход, образование, власть, престиж.' },
                { term: 'Социальный статус', desc: 'Положение человека в обществе, определяющее его права и обязанности.' },
                { term: 'Социальная роль', desc: 'Модель поведения, ожидаемая от человека с определённым статусом.' },
                { term: 'Социальная мобильность', desc: 'Перемещение человека или группы в социальной структуре общества.' },
                { term: 'Социальный лифт', desc: 'Каналы вертикальной мобильности: образование, брак, карьера, бизнес.' },
                { term: 'Социальный конфликт', desc: 'Столкновение противоположных интересов. Важно различать причину и повод.' },
              ].filter(c => gameState.journal.includes(c.term) || gameState.journal.length > 3).map(c => (
                <div key={c.term} style={{padding: '0.5rem', background: 'rgba(0,212,170,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent-teal)'}}>
                  <strong style={{color: 'var(--accent-yellow)', fontSize: '0.9rem'}}>{c.term}</strong>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem'}}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="passport-card" style={{textAlign: 'left', maxWidth: 600}}>
            <h3 style={{color: 'var(--accent-coral)', marginBottom: '0.5rem'}}>📝 Рекомендации</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
              {gameState.achievements.length < 5 
                ? 'Попробуй пройти игру ещё раз за другого персонажа — ты увидишь другие стороны общества.'
                : 'Отлично! Ты хорошо разобрался в основных понятиях. Повтори тему конфликтов и мобильности для закрепления.'}
            </p>
          </div>

          <div className="ending-buttons">
            <button className="btn btn-primary" onClick={resetGame}>Пройти заново</button>
            <button className="btn btn-secondary" onClick={() => { setGameState(prev => ({...prev, ending: null})); setScreen('creation'); }}>Другой персонаж</button>
            <button className="btn btn-secondary" onClick={() => setScreen('passport')}>Социологический паспорт</button>
            <button className="btn btn-secondary" onClick={() => setScreen('glossary')}>Глоссарий</button>
            <button className="btn btn-secondary" onClick={downloadHTML} style={{background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none'}}>📥 Скачать HTML</button>
          </div>
        </div>
      )}

      {/* PASSPORT SCREEN */}
      {screen === 'passport' && (
        <div className="passport-screen">
          <div className="passport-card">
            <div className="passport-header">
              <h2>📋 Социологический паспорт</h2>
              <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>г. Социум</p>
              {gameState.studentCode && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(155,89,182,0.15)',
                  borderRadius: '12px',
                  border: '2px solid var(--accent-purple)'
                }}>
                  <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>
                    Ваш код ученика:
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    color: 'var(--accent-purple)',
                    letterSpacing: '0.1em'
                  }}>
                    {gameState.studentCode}
                  </div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>
                    Запишите этот код и передайте его учителю
                  </div>
                </div>
              )}
            </div>

            <div className="passport-section">
              <h4>👤 Персонаж</h4>
              <p>{gameState.character?.name}, {gameState.character?.gender === 'М' ? 'мужчина' : 'женщина'}, {gameState.character?.age || 14} лет (на старте)</p>
              <p>Район: {gameState.character?.district}</p>
              <p>Семья: {gameState.character?.family}</p>
            </div>

            <div className="passport-section">
              <h4>📌 Предписанные статусы</h4>
              <ul>{gameState.statuses.prescribed.map(s => <li key={s}>{s}</li>)}</ul>
            </div>

            <div className="passport-section">
              <h4>🎯 Достигаемые статусы</h4>
              <ul>{gameState.statuses.achieved.map(s => <li key={s}>{s}</li>)}</ul>
            </div>

            <div className="passport-section">
              <h4>🎭 Социальные роли</h4>
              <ul>{gameState.roles.map(r => <li key={r}>{r}</li>)}</ul>
            </div>

            <div className="passport-section">
              <h4>📊 Текущая страта</h4>
              <p>{gameState.strata}</p>
            </div>

            <div className="passport-section">
              <h4>📈 Ресурсы</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem'}}>
                <p>Доход: {gameState.resources.income}</p>
                <p>Образование: {gameState.resources.education}</p>
                <p>Престиж: {gameState.resources.prestige}</p>
                <p>Власть: {gameState.resources.power}</p>
                <p>Связи: {gameState.resources.socialConnections}</p>
                <p>Семья: {gameState.resources.familyWellbeing}</p>
                <p>Устойчивость: {gameState.resources.innerStability}</p>
                <p>Репутация: {gameState.resources.reputation}</p>
              </div>
            </div>

            <div className="passport-section">
              <h4>🔄 Мобильность</h4>
              {gameState.mobilityEvents.length > 0 ? (
                <ul>{gameState.mobilityEvents.map(m => <li key={m}>{m}</li>)}</ul>
              ) : <p>Не зафиксирована</p>}
            </div>

            <div className="passport-section">
              <h4>🛗 Социальные лифты</h4>
              {gameState.socialLifts.length > 0 ? (
                <ul>{gameState.socialLifts.map(l => <li key={l}>{l}</li>)}</ul>
              ) : <p>Не использованы</p>}
            </div>

            <div className="passport-section">
              <h4>⚔️ Конфликты</h4>
              {gameState.conflicts.length > 0 ? (
                <p>Участие в {gameState.conflicts.length} конфликт(ах)</p>
              ) : <p>Конфликтов не зафиксировано</p>}
            </div>

            <div className="passport-section">
              <h4>🏆 Достижения</h4>
              {gameState.achievements.length > 0 ? (
                <ul>{gameState.achievements.map(a => <li key={a}>{ACHIEVEMENTS[a]?.name}</li>)}</ul>
              ) : <p>Пока нет</p>}
            </div>
          </div>

          <div style={{display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button className="btn btn-primary" onClick={() => setScreen('ending')}>К концовке →</button>
            <button className="btn btn-secondary" onClick={() => setScreen('game')}>Вернуться к игре</button>
            <button className="btn btn-secondary" onClick={() => {
              const text = `СОЦИОЛОГИЧЕСКИЙ ПАСПОРТ\nПерсонаж: ${gameState.character?.name}\nСтратa: ${gameState.strata}\nСтатусы: ${gameState.statuses.achieved.join(', ')}\nРоли: ${gameState.roles.join(', ')}`;
              navigator.clipboard?.writeText(text).then(() => alert('Паспорт скопирован!'));
            }}>📋 Копировать</button>
            {gameState.studentCode && (
              <button className="btn btn-secondary" onClick={() => exportStudentProgress(gameState)} style={{background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', border: 'none'}}>
                📤 Экспорт для учителя
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CHARACTER CREATION COMPONENT =====
const CharacterCreation: React.FC<{onCreate: (c: Character) => void; onBack: () => void}> = ({onCreate, onBack}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('М');
  const [district, setDistrict] = useState('Спальный район');
  const [family, setFamily] = useState('Семья учителей/врачей');

  const handleSubmit = () => {
    if (!name.trim()) { alert('Введите имя персонажа'); return; }
    onCreate({ name: name.trim(), gender, age: 14, district, family });
  };

  return (
    <div className="creation-screen">
      <h1 className="creation-title">Создание персонажа</h1>
      <div className="creation-form">
        <div className="form-group">
          <label>Имя персонажа</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Введите имя..." maxLength={20}/>
        </div>

        <div className="form-group">
          <label>Пол</label>
          <div className="radio-group">
            {['М', 'Ж'].map(g => (
              <div key={g} className={`radio-option ${gender === g ? 'selected' : ''}`} onClick={() => setGender(g)}>
                {g === 'М' ? '♂ Мужской' : '♀ Женский'}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Район города Социум</label>
          <div className="radio-group">
            {['Рабочий район', 'Спальный район', 'Центр', 'Приморский район'].map(d => (
              <div key={d} className={`radio-option ${district === d ? 'selected' : ''}`} onClick={() => setDistrict(d)}>
                {d}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Семья</label>
          <div className="radio-group">
            {['Рабочая семья', 'Семья учителей/врачей', 'Семья предпринимателей', 'Неполная семья', 'Семья мигрантов'].map(f => (
              <div key={f} className={`radio-option ${family === f ? 'selected' : ''}`} onClick={() => setFamily(f)}>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{display: 'flex', gap: '0.75rem', marginTop: '1rem'}}>
          <button className="btn btn-secondary" onClick={onBack}>← Назад</button>
          <button className="btn btn-primary" onClick={handleSubmit} style={{flex: 1}}>Начать игру →</button>
        </div>
      </div>
    </div>
  );
};
