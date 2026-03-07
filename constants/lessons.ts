export const TOTAL_STEPS = 10;

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LessonScreen =
  | {
      id: string;
      type: "checklist";
      title: string;
      subtitle?: string;
      items: string[];
    }
  | {
      id: string;
      type: "video";
      title: string;
      subtitle?: string;
      videoUrl: string;
      captions: string[];
    }
  | {
      id: string;
      type: "quiz";
      title: string;
      subtitle?: string;
      question: QuizQuestion;
    }
  | {
      id: string;
      type: "protocol";
      title: string;
      subtitle?: string;
      steps: Array<{ title: string; details: string }>;
    };

export type Lesson = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  premium: boolean;
  chain: {
    a: string;
    b: string;
    c: string;
  };
  readinessChecks: string[];
  quiz: QuizQuestion[];
  screens: LessonScreen[];
};

function createScreens(baseId: string, a: string, b: string, c: string): LessonScreen[] {
  return [
    {
      id: `${baseId}-screen-1`,
      type: "checklist",
      title: "Screen 1: Readiness Checklist",
      subtitle: "Проверьте базовую готовность перед переходом к уроку.",
      items: [
        `Я распознаю все элементы цепочки: ${a}, ${b}, ${c}.`,
        `Я могу объяснить связь ${a} -> ${b}.`,
        `Я могу объяснить связь ${b} -> ${c}.`,
      ],
    },
    {
      id: `${baseId}-screen-2`,
      type: "video",
      title: "Screen 2: Video Demonstration",
      subtitle: "Просмотрите короткий пример цепочки в действии.",
      videoUrl: "https://www.youtube.com/shorts/S1LDKjIPSCc",
      captions: [
        "Тренер показывает первую связь A -> B.",
        "Затем закрепляется связь B -> C.",
        "Финальный вывод: A -> C.",
      ],
    },
    {
      id: `${baseId}-screen-3`,
      type: "protocol",
      title: "Screen 3: Guided Protocol",
      subtitle: "Следуйте шагам протокола по очереди.",
      steps: [
        { title: "Подготовка", details: "Подготовьте карточки и визуальные опоры для трех элементов." },
        { title: "Моделирование", details: `Покажите, как ${a} связано с ${b}, затем как ${b} связано с ${c}.` },
        { title: "Проверка", details: `Попросите ученика вывести связь ${a} -> ${c}.` },
      ],
    },
    {
      id: `${baseId}-screen-4`,
      type: "quiz",
      title: "Screen 4: Quick Quiz",
      question: {
        question: `Если ${a} -> ${b} и ${b} -> ${c}, что следует?`,
        options: [`${a} -> ${c}`, `${c} -> ${a}`, `${b} -> ${a}`],
        correctIndex: 0,
        explanation: "По принципу транзитивности A -> B и B -> C дают A -> C.",
      },
    },
    {
      id: `${baseId}-screen-5`,
      type: "checklist",
      title: "Screen 5: Readiness Reinforcement",
      items: [
        "Я могу назвать центральный элемент B без подсказок.",
        "Я различаю прямую и обратную связь.",
        "Я готов(а) применить правило на новом примере.",
      ],
    },
    {
      id: `${baseId}-screen-6`,
      type: "video",
      title: "Screen 6: Context Video",
      subtitle: "Контекстное повторение с вариациями.",
      videoUrl: "https://youtube.com/shorts/iKH8urXcnIU?feature=share",
      captions: [
        "Добавьте новый контекст к знакомой цепочке.",
        "Сравните правильный и ошибочный вывод.",
      ],
    },
    {
      id: `${baseId}-screen-7`,
      type: "protocol",
      title: "Screen 7: Expandable Protocol",
      steps: [
        { title: "Шаг 1", details: "Дайте ученику 2-3 примера с подсказкой." },
        { title: "Шаг 2", details: "Постепенно убирайте подсказку и просите объяснение." },
        { title: "Шаг 3", details: "Фиксируйте процент правильных выводов." },
      ],
    },
    {
      id: `${baseId}-screen-8`,
      type: "quiz",
      title: "Screen 8: Assessment Quiz",
      question: {
        question: `Какой элемент в цепочке ${a} -> ${b} -> ${c} является центральным?`,
        options: [a, b, c],
        correctIndex: 1,
        explanation: `${b} — это связующее звено между A и C.`,
      },
    },
    {
      id: `${baseId}-screen-9`,
      type: "protocol",
      title: "Screen 9: Generalization",
      steps: [
        { title: "Новый пример", details: "Выберите новую тройку объектов с похожей логикой." },
        { title: "Самостоятельная попытка", details: "Попросите пройти цепочку без подсказок." },
        { title: "Обратная связь", details: "Поддержите корректные выводы и исправьте ошибки." },
      ],
    },
    {
      id: `${baseId}-screen-10`,
      type: "quiz",
      title: "Screen 10: Final Check",
      question: {
        question: "Что является ключевым правилом этого урока?",
        options: [
          "A -> B и B -> C, значит A -> C",
          "A -> C всегда отменяет B",
          "B не влияет на вывод",
        ],
        correctIndex: 0,
        explanation: "Это и есть базовое правило транзитивности.",
      },
    },
  ];
}

export const lessons: Lesson[] = [
  {
    id: "products",
    title: "Lesson 1: Products",
    shortTitle: "Products",
    subtitle: "Curd -> Milk -> Fridge",
    premium: false,
    chain: { a: "Curd", b: "Milk", c: "Fridge" },
    readinessChecks: [
      "I can identify all three objects in the chain.",
      "I can explain why the first item belongs to the second category.",
      "I can explain why the second item belongs to the third category.",
      "I can describe the full A -> C connection in one sentence.",
      "I can give a real-world example using this chain.",
    ],
    quiz: [
      {
        question: "Which chain is correct for this lesson?",
        options: ["Curd -> Milk -> Fridge", "Milk -> Curd -> Fridge", "Curd -> Fridge -> Milk"],
        correctIndex: 0,
        explanation: "The lesson chain is exactly Curd -> Milk -> Fridge.",
      },
    ],
    screens: createScreens("products", "Curd", "Milk", "Fridge"),
  },
  {
    id: "characters",
    title: "Lesson 2: Characters",
    shortTitle: "Characters",
    subtitle: "Masha -> Girl -> Armchair",
    premium: true,
    chain: { a: "Masha", b: "Girl", c: "Armchair" },
    readinessChecks: [
      "I can explain who Masha is in this context.",
      "I can map Masha to the broader category Girl.",
      "I can explain the relation between Girl and Armchair.",
    ],
    quiz: [
      {
        question: "What is the correct sequence in this lesson?",
        options: ["Masha -> Girl -> Armchair", "Armchair -> Girl -> Masha", "Girl -> Masha -> Armchair"],
        correctIndex: 0,
        explanation: "The chain starts from Masha, then Girl, then Armchair.",
      },
    ],
    screens: createScreens("characters", "Masha", "Girl", "Armchair"),
  },
  {
    id: "situations",
    title: "Lesson 3: Situations",
    shortTitle: "Situations",
    subtitle: "Sled -> Winter -> Scarf",
    premium: true,
    chain: { a: "Sled", b: "Winter", c: "Scarf" },
    readinessChecks: [
      "I can describe why a sled belongs to this context.",
      "I can identify Winter as the central concept.",
      "I can explain the link from Winter to Scarf.",
    ],
    quiz: [
      {
        question: "What is the lesson chain?",
        options: ["Sled -> Winter -> Scarf", "Scarf -> Winter -> Sled", "Winter -> Sled -> Scarf"],
        correctIndex: 0,
        explanation: "The correct order is Sled, then Winter, then Scarf.",
      },
    ],
    screens: createScreens("situations", "Sled", "Winter", "Scarf"),
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
