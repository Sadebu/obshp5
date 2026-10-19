import React, { useState, useEffect } from 'react';
import { StudentResult } from '../game/types';
import { importStudentProgress, exportReport, exportToCSV } from '../game/teacher';

interface TeacherModeProps {
  onBack: () => void;
}

const TEACHER_STORAGE_KEY = 'socicum_teacher_students';

export default function TeacherMode({ onBack }: TeacherModeProps) {
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<string>('');

  // Загрузка сохранённых данных
  useEffect(() => {
    const saved = localStorage.getItem(TEACHER_STORAGE_KEY);
    if (saved) {
      try {
        setStudents(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка загрузки данных учителя');
      }
    }
  }, []);

  // Сохранение данных
  const saveStudents = (newStudents: StudentResult[]) => {
    setStudents(newStudents);
    localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(newStudents));
  };

  // Импорт файла ученика
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newStudents = [...students];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await importStudentProgress(files[i]);
        // Проверяем, нет ли уже такого ученика
        const existingIdx = newStudents.findIndex(s => s.code === result.code);
        if (existingIdx >= 0) {
          newStudents[existingIdx] = result;
        } else {
          newStudents.push(result);
        }
      } catch (error) {
        alert(`Ошибка при импорте файла ${files[i].name}`);
      }
    }

    saveStudents(newStudents);
    event.target.value = ''; // Сброс input
  };

  // Удаление ученика
  const handleDelete = (code: string) => {
    if (confirm('Удалить этого ученика из списка?')) {
      const newStudents = students.filter(s => s.code !== code);
      saveStudents(newStudents);
      if (selectedStudent?.code === code) {
        setSelectedStudent(null);
      }
    }
  };

  // Сохранение оценки
  const handleSaveGrade = () => {
    if (!selectedStudent || editingGrade === null) return;
    
    const newStudents = students.map(s => 
      s.code === selectedStudent.code 
        ? { ...s, grade: editingGrade, comment: editingComment }
        : s
    );
    saveStudents(newStudents);
    setSelectedStudent({ ...selectedStudent, grade: editingGrade, comment: editingComment });
    setEditingGrade(null);
    setEditingComment('');
  };

  // Статистика
  const stats = {
    total: students.length,
    avgGrade: students.length > 0 
      ? (students.reduce((sum, s) => sum + s.grade, 0) / students.length).toFixed(2)
      : '0',
    completed: students.filter(s => s.progress.ending).length,
    excellent: students.filter(s => s.grade === 5).length,
    good: students.filter(s => s.grade === 4).length,
    satisfactory: students.filter(s => s.grade === 3).length,
    poor: students.filter(s => s.grade <= 2).length,
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--accent-yellow)'
        }}>
          👨‍🏫 Режим учителя
        </h1>
        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          ← Назад в меню
        </button>
      </div>

      {/* Панель импорта */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '2px solid rgba(255,255,255,0.1)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-teal)' }}>
          📥 Импорт результатов учеников
        </h3>
        
        {students.length === 0 && (
          <div style={{
            background: 'rgba(0,212,170,0.1)',
            border: '2px solid var(--accent-teal)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ color: 'var(--accent-teal)', marginBottom: '0.5rem', fontSize: '1rem' }}>
              📖 Как это работает?
            </h4>
            <ol style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.5rem' }}>
              <li>Ученики проходят игру и получают уникальный код (SOC-XXXXXX)</li>
              <li>Нажимают кнопку <strong>"📤 Экспорт для учителя"</strong> в игре</li>
              <li>Отправляют вам JSON-файл (через email, мессенджер, облако)</li>
              <li>Вы загружаете файлы здесь и видите результаты</li>
              <li>Система автоматически оценивает каждого ученика</li>
              <li>Вы можете скорректировать оценку и добавить комментарий</li>
            </ol>
          </div>
        )}
        
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Загрузите JSON-файлы, которые экспортировали ученики
        </p>
        <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
          Выбрать файлы
          <input
            type="file"
            accept=".json"
            multiple
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
        
        {students.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => exportReport(students)}
            >
              📄 Экспорт отчёта (TXT)
            </button>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => exportToCSV(students)}
            >
              📊 Экспорт в CSV (Excel)
            </button>
          </div>
        )}
      </div>

      {/* Статистика */}
      {students.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(0,212,170,0.1)',
            padding: '1rem',
            borderRadius: '12px',
            border: '2px solid var(--accent-teal)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Всего учеников
            </div>
          </div>
          <div style={{
            background: 'rgba(255,215,0,0.1)',
            padding: '1rem',
            borderRadius: '12px',
            border: '2px solid var(--accent-yellow)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-yellow)' }}>
              {stats.avgGrade}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Средняя оценка
            </div>
          </div>
          <div style={{
            background: 'rgba(74,222,128,0.1)',
            padding: '1rem',
            borderRadius: '12px',
            border: '2px solid var(--green)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)' }}>
              {stats.completed}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Завершили игру
            </div>
          </div>
          <div style={{
            background: 'rgba(155,89,182,0.1)',
            padding: '1rem',
            borderRadius: '12px',
            border: '2px solid var(--accent-purple)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
              {stats.excellent}/{stats.good}/{stats.satisfactory}/{stats.poor}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              5/4/3/1-2
            </div>
          </div>
        </div>
      )}

      {/* Таблица учеников */}
      {students.length > 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,212,170,0.1)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--accent-teal)' }}>Код</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--accent-teal)' }}>Имя</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--accent-teal)' }}>Оценка</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--accent-teal)' }}>Прогресс</th>
                <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--accent-teal)' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.code}
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => {
                    setSelectedStudent(student);
                    setEditingGrade(student.grade);
                    setEditingComment(student.comment);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--accent-yellow)' }}>
                    {student.code}
                  </td>
                  <td style={{ padding: '1rem' }}>{student.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontWeight: 700,
                      background: student.grade === 5 ? 'rgba(74,222,128,0.2)' :
                                 student.grade === 4 ? 'rgba(0,212,170,0.2)' :
                                 student.grade === 3 ? 'rgba(255,215,0,0.2)' :
                                 'rgba(255,107,107,0.2)',
                      color: student.grade === 5 ? 'var(--green)' :
                             student.grade === 4 ? 'var(--accent-teal)' :
                             student.grade === 3 ? 'var(--accent-yellow)' :
                             'var(--accent-coral)',
                      border: `2px solid ${
                        student.grade === 5 ? 'var(--green)' :
                        student.grade === 4 ? 'var(--accent-teal)' :
                        student.grade === 3 ? 'var(--accent-yellow)' :
                        'var(--accent-coral)'
                      }`
                    }}>
                      {student.grade}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {student.progress.sceneHistory.length} сцен
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(student.code);
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Пока нет импортированных результатов
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            Ученики должны экспортировать свой прогресс из игры и отправить вам JSON-файлы
          </p>
        </div>
      )}

      {/* Модальное окно с деталями ученика */}
      {selectedStudent && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '700px' }}
          >
            <h2 style={{ color: 'var(--accent-yellow)', marginBottom: '1.5rem' }}>
              👤 {selectedStudent.name}
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Код ученика
                </div>
                <div style={{ fontFamily: 'monospace', color: 'var(--accent-yellow)', fontWeight: 600 }}>
                  {selectedStudent.code}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Возраст персонажа
                </div>
                <div>{selectedStudent.progress.character?.age || 14} лет</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Район
                </div>
                <div>{selectedStudent.progress.character?.district || 'Не указан'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Семья
                </div>
                <div>{selectedStudent.progress.character?.family || 'Не указана'}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: 'var(--accent-teal)', marginBottom: '0.75rem' }}>
                📊 Прогресс
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div>Сцен пройдено: <strong>{selectedStudent.progress.sceneHistory.length}</strong></div>
                <div>Достижений: <strong>{selectedStudent.progress.achievements.length}/10</strong></div>
                <div>Статусов: <strong>{selectedStudent.progress.statuses.achieved.length}</strong></div>
                <div>Ролей: <strong>{selectedStudent.progress.roles.length}</strong></div>
                <div>Конфликтов: <strong>{selectedStudent.progress.conflicts.length}</strong></div>
                <div>Социальных лифтов: <strong>{selectedStudent.progress.socialLifts.length}</strong></div>
                <div>Страта: <strong>{selectedStudent.progress.strata}</strong></div>
                <div>Финал: <strong>{selectedStudent.progress.ending || 'не завершён'}</strong></div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: 'var(--accent-teal)', marginBottom: '0.75rem' }}>
                💰 Ресурсы
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div>Доход: <strong>{selectedStudent.progress.resources.income}</strong></div>
                <div>Образование: <strong>{selectedStudent.progress.resources.education}</strong></div>
                <div>Престиж: <strong>{selectedStudent.progress.resources.prestige}</strong></div>
                <div>Власть: <strong>{selectedStudent.progress.resources.power}</strong></div>
                <div>Связи: <strong>{selectedStudent.progress.resources.socialConnections}</strong></div>
                <div>Семья: <strong>{selectedStudent.progress.resources.familyWellbeing}</strong></div>
                <div>Устойчивость: <strong>{selectedStudent.progress.resources.innerStability}</strong></div>
                <div>Репутация: <strong>{selectedStudent.progress.resources.reputation}</strong></div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Оценка (автоматически: {selectedStudent.grade})
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[5, 4, 3, 2, 1].map((grade) => (
                  <button
                    key={grade}
                    className="btn btn-small"
                    onClick={() => setEditingGrade(grade)}
                    style={{
                      flex: 1,
                      background: editingGrade === grade
                        ? grade === 5 ? 'var(--green)' :
                          grade === 4 ? 'var(--accent-teal)' :
                          grade === 3 ? 'var(--accent-yellow)' :
                          'var(--accent-coral)'
                        : 'rgba(255,255,255,0.1)',
                      color: editingGrade === grade ? '#fff' : 'var(--text-primary)',
                      border: `2px solid ${
                        grade === 5 ? 'var(--green)' :
                        grade === 4 ? 'var(--accent-teal)' :
                        grade === 3 ? 'var(--accent-yellow)' :
                        'var(--accent-coral)'
                      }`,
                      fontWeight: 700
                    }}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Комментарий
              </label>
              <textarea
                value={editingComment}
                onChange={(e) => setEditingComment(e.target.value)}
                placeholder="Добавьте комментарий для ученика..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={handleSaveGrade}
                style={{ flex: 1 }}
              >
                💾 Сохранить оценку
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedStudent(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
