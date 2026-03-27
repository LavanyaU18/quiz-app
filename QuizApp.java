import java.util.*;

class Question {
    String question;
    String[] options;
    String correct;

    Question(String question, String[] options, String correct) {
        this.question = question;
        this.options = options;
        this.correct = correct;
    }

    boolean ask(Scanner sc) {
        System.out.println("\n" + question);
        for (String opt : options) {
            System.out.println(opt);
        }

        System.out.print("Enter answer: ");
        String ans = sc.nextLine();

        if (ans.equalsIgnoreCase(correct)) {
            System.out.println("Correct ✅");
            return true;
        } else {
            System.out.println("Wrong ❌ (Correct: " + correct + ")");
            return false;
        }
    }
}

public class QuizApp {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        int score = 0;

        List<Question> list = new ArrayList<>();

        list.add(new Question(
                "1. Capital of India?",
                new String[]{"a) Mumbai", "b) Delhi", "c) Chennai"},
                "b"
        ));

        list.add(new Question(
                "2. CI stands for?",
                new String[]{"a) Continuous Integration", "b) Code Input", "c) Central Info"},
                "a"
        ));

        list.add(new Question(
                "3. Which tool is used in CI/CD?",
                new String[]{"a) Git", "b) Jenkins", "c) HTML"},
                "b"
        ));

        list.add(new Question(
                "4. Which command compiles Java?",
                new String[]{"a) java", "b) run", "c) javac"},
                "c"
        ));

        System.out.println("🚀 Welcome to Quiz App");

        for (Question q : list) {
            if (q.ask(sc)) {
                score++;
            }
        }

        System.out.println("\n🎯 Final Score: " + score + "/" + list.size());

        if (score == list.size()) {
            System.out.println("🔥 Excellent!");
        } else if (score >= 2) {
            System.out.println("👍 Good!");
        } else {
            System.out.println("📚 Try again!");
        }

        sc.close();
    }
}
