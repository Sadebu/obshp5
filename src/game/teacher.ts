// Система отслеживания прогресса для учителя
import { GameState, StudentResult } from './types';

// Генерация уникального кода ученика
export const generateStudentCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SOC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Экспорт прогресса ученика в JSON
export const exportStudentProgress = (state: GameState): void => {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    studentCode: state.studentCode,
    progress: state
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `СОЦИУМ_${state.studentCode}_${state.character?.name || 'ученик'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Импорт прогресса ученика
export const importStudentProgress = (file: File): Promise<StudentResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.progress || !data.studentCode) {
          reject(new Error('Неверный формат файла'));
          return;
        }
        
        const result: StudentResult = {
          code: data.studentCode,
          name: data.progress.character?.name || 'Неизвестный',
          grade: calculateGrade(data.progress),
          comment: '',
          progress: data.progress,
          importedAt: new Date().toISOString()
        };
        
        resolve(result);
      } catch (error) {
        reject(new Error('Ошибка чтения файла'));
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
};

// Автоматический расчёт оценки (5-балльная система)
export const calculateGrade = (state: GameState): number => {
  let score = 0;
  let maxScore = 0;
  
  // 1. Прогресс по сюжету (макс 30 баллов)
  maxScore += 30;
  const totalScenes = 30; // примерное количество сцен
  const completedScenes = state.sceneHistory.length;
  score += Math.min(30, (completedScenes / totalScenes) * 30);
  
  // 2. Мини-игры (макс 25 баллов)
  maxScore += 25;
  if (state.minigameScores) {
    const scores = Object.values(state.minigameScores);
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      score += (avgScore / 100) * 25;
    }
  }
  
  // 3. Достижения (макс 20 баллов)
  maxScore += 20;
  const achievementCount = state.achievements.length;
  const maxAchievements = 10;
  score += Math.min(20, (achievementCount / maxAchievements) * 20);
  
  // 4. Финальная концовка (макс 15 баллов)
  maxScore += 15;
  if (state.ending) {
    // Все концовки дают базовые баллы
    score += 10;
    // Бонус за "хорошие" концовки
    if (['ascending', 'stable', 'bridge', 'architect'].includes(state.ending)) {
      score += 5;
    }
  }
  
  // 5. Изучение глоссария (макс 10 баллов)
  maxScore += 10;
  const journalCount = state.journal.length;
  score += Math.min(10, (journalCount / 8) * 10);
  
  // Конвертация в 5-балльную систему
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 5;
  if (percentage >= 75) return 4;
  if (percentage >= 60) return 3;
  if (percentage >= 40) return 2;
  return 1;
};

// Генерация отчёта для учителя
export const generateTeacherReport = (students: StudentResult[]): string => {
  let report = 'ОТЧЁТ ПО ИГРЕ "СОЦИУМ: жизнь в обществе"\n';
  report += '=========================================\n\n';
  report += `Дата: ${new Date().toLocaleDateString('ru-RU')}\n`;
  report += `Количество учеников: ${students.length}\n\n`;
  
  // Статистика
  const grades = students.map(s => s.grade);
  const avgGrade = grades.reduce((a, b) => a + b, 0) / grades.length;
  const excellent = grades.filter(g => g === 5).length;
  const good = grades.filter(g => g === 4).length;
  const satisfactory = grades.filter(g => g === 3).length;
  const poor = grades.filter(g => g <= 2).length;
  
  report += 'ОБЩАЯ СТАТИСТИКА:\n';
  report += `Средняя оценка: ${avgGrade.toFixed(2)}\n`;
  report += `Отлично (5): ${excellent}\n`;
  report += `Хорошо (4): ${good}\n`;
  report += `Удовлетворительно (3): ${satisfactory}\n`;
  report += `Неудовлетворительно (1-2): ${poor}\n\n`;
  
  report += 'ДЕТАЛЬНЫЕ РЕЗУЛЬТАТЫ:\n';
  report += '---------------------\n\n';
  
  students.forEach((student, idx) => {
    report += `${idx + 1}. ${student.name}\n`;
    report += `   Код: ${student.code}\n`;
    report += `   Оценка: ${student.grade}\n`;
    if (student.comment) {
      report += `   Комментарий: ${student.comment}\n`;
    }
    report += `   Прогресс: ${student.progress.sceneHistory.length} сцен пройдено\n`;
    report += `   Достижения: ${student.progress.achievements.length}/10\n`;
    report += `   Финал: ${student.progress.ending || 'не завершено'}\n`;
    report += `   Стратa: ${student.progress.strata}\n`;
    report += '\n';
  });
  
  return report;
};

// Экспорт отчёта в текстовый файл
export const exportReport = (students: StudentResult[]): void => {
  const report = generateTeacherReport(students);
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `СОЦИУМ_отчёт_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Экспорт в CSV для Excel
export const exportToCSV = (students: StudentResult[]): void => {
  const headers = ['Код', 'Имя', 'Оценка', 'Комментарий', 'Сцен пройдено', 'Достижений', 'Финал', 'Страта'];
  const rows = students.map(s => [
    s.code,
    s.name,
    s.grade,
    s.comment,
    s.progress.sceneHistory.length,
    s.progress.achievements.length,
    s.progress.ending || 'не завершено',
    s.progress.strata
  ]);
  
  const csv = [
    headers.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\n');
  
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `СОЦИУМ_результаты_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
