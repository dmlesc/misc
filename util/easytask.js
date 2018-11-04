// JavaScript source code


function accomplish_a_task(emp, task) {
    if (!easyToDoWhatsRight(emp)) {
        refactorMindset(emp);
        reevaluate(task);
        accomplish_a_task(emp, task);
    }
    else {
        letPassionAndBeliefTakeOver(emp, task);  // Value 3
        emp.funLevel++;                          // Value 7
        emp.happiness++;
    }
}

