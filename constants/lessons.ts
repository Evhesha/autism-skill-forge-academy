export const TOTAL_STEPS = 10;

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  chain: {
    a: string;
    b: string;
    c: string;
  };
  readinessChecks: string[];
  quiz: QuizQuestion[];
};

export const lessons: Lesson[] = [
  {
    id: "products",
    title: "Lesson 1: Products",
    subtitle: "Curd -> Milk -> Fridge",
    chain: {
      a: "Curd",
      b: "Milk",
      c: "Fridge",
    },
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
        options: [
          "Curd -> Milk -> Fridge",
          "Milk -> Curd -> Fridge",
          "Curd -> Fridge -> Milk",
        ],
        correctIndex: 0,
        explanation: "The lesson chain is exactly Curd -> Milk -> Fridge.",
      },
      {
        question: "If Curd is connected to Milk and Milk to Fridge, what follows?",
        options: [
          "Curd -> Fridge",
          "Fridge -> Curd",
          "Milk -> Curd",
        ],
        correctIndex: 0,
        explanation: "By transitivity, A -> B and B -> C imply A -> C.",
      },
      {
        question: "What is the middle element (B) in this chain?",
        options: ["Curd", "Milk", "Fridge"],
        correctIndex: 1,
        explanation: "Milk is the bridge between Curd and Fridge.",
      },
    ],
  },
  {
    id: "characters",
    title: "Lesson 2: Characters",
    subtitle: "Masha -> Girl -> Armchair",
    chain: {
      a: "Masha",
      b: "Girl",
      c: "Armchair",
    },
    readinessChecks: [
      "I can explain who Masha is in this context.",
      "I can map Masha to the broader category Girl.",
      "I can explain the relation between Girl and Armchair.",
      "I can infer Masha -> Armchair from the full chain.",
      "I can retell the chain without looking at prompts.",
    ],
    quiz: [
      {
        question: "What is the correct sequence in this lesson?",
        options: [
          "Masha -> Girl -> Armchair",
          "Armchair -> Girl -> Masha",
          "Girl -> Masha -> Armchair",
        ],
        correctIndex: 0,
        explanation: "The chain starts from Masha, then Girl, then Armchair.",
      },
      {
        question: "What does transitivity imply here?",
        options: [
          "Masha -> Armchair",
          "Armchair -> Masha",
          "Girl -> Masha",
        ],
        correctIndex: 0,
        explanation: "If Masha -> Girl and Girl -> Armchair, then Masha -> Armchair.",
      },
      {
        question: "Which element is B?",
        options: ["Masha", "Girl", "Armchair"],
        correctIndex: 1,
        explanation: "Girl is the middle connecting concept.",
      },
    ],
  },
  {
    id: "situations",
    title: "Lesson 3: Situations",
    subtitle: "Sled -> Winter -> Scarf",
    chain: {
      a: "Sled",
      b: "Winter",
      c: "Scarf",
    },
    readinessChecks: [
      "I can describe why a sled belongs to this context.",
      "I can identify Winter as the central concept.",
      "I can explain the link from Winter to Scarf.",
      "I can infer Sled -> Scarf using the chain.",
      "I can apply this logic chain to another winter object.",
    ],
    quiz: [
      {
        question: "What is the lesson chain?",
        options: [
          "Sled -> Winter -> Scarf",
          "Scarf -> Winter -> Sled",
          "Winter -> Sled -> Scarf",
        ],
        correctIndex: 0,
        explanation: "The correct order is Sled, then Winter, then Scarf.",
      },
      {
        question: "Which inference is valid?",
        options: [
          "Sled -> Scarf",
          "Scarf -> Sled",
          "Winter -> Sled",
        ],
        correctIndex: 0,
        explanation: "A -> B and B -> C always lead to A -> C.",
      },
      {
        question: "What is C in this lesson?",
        options: ["Sled", "Winter", "Scarf"],
        correctIndex: 2,
        explanation: "Scarf is the final target element C.",
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
