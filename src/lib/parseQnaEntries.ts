interface QnAEntry {
    question: string;
    answer: string;
    options?: string[];
    correctAnswer?: string | null;
}

export const parseQnaEntries = (completion: string, questionType: "subjective" | "mcq"): QnAEntry[] => {
    
    if (!completion || typeof completion !== 'string') {
        throw new Error("Invalid completion input");
    }

    console.log("Raw completion input:", completion);
    
    const qnaEntries: QnAEntry[] = [];
    const entries = completion.trim().split('\n\n'); // Split based on two newlines

    console.log(entries)

    for (const entry of entries) {
        const lines = entry.split('\n');
        console.log("new linel", lines)
        let question = '';
        let answer = '';
        let options: string[] = [];
        let correctAnswer: string | null = null;

        // Extract question and answer based on question type
        if (questionType === 'subjective') {
            question = lines[0].replace(/^Question:\s*/, '').trim();
            answer = lines[1].replace(/^Answer:\s*/, '').trim();
        } else { // MCQ
            question = lines[0].replace(/^Question:\s*/, '').trim();
            // Assuming options are listed after "Options:"
            const optionsLineIndex = lines.findIndex(line => line.startsWith('Options:'));
            if (optionsLineIndex !== -1) {
                options = lines.slice(optionsLineIndex + 1, -1) // Collect options until the last line
                    .map(option => option.replace(/^(\d+\.\s)/, '').trim());
            }
            correctAnswer = lines.find(line => line.startsWith('Answer:'))?.replace(/^Answer:\s*/, '').trim() || null;
        }

        // Push the constructed QnAEntry object
        qnaEntries.push({ question, answer, options: questionType === 'mcq' ? options : undefined, correctAnswer });
    }

    return qnaEntries;
};
