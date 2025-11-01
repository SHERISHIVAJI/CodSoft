document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const historyElement = document.getElementById('history');
    const buttons = document.querySelector('.calculator-buttons');

    let displayValue = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;
    let historyText = '';
    let isErrorState = false;

    function updateDisplay() {
        if (isErrorState) {
            display.value = displayValue;
            display.classList.add('error');
        } else {
            const num = parseFloat(displayValue);
            display.value = displayValue.length > 15 && num !== 0 && !isNaN(num) 
                ? num.toPrecision(12) 
                : displayValue;
            display.classList.remove('error');
        }
        historyElement.textContent = historyText;
    }

    function clearAll() {
        displayValue = '0'; firstOperand = null; operator = null;
        waitingForSecondOperand = false; historyText = ''; isErrorState = false;
    }

    function inputDigit(digit) {
        if (isErrorState) clearAll();
        if (waitingForSecondOperand) { displayValue = digit; waitingForSecondOperand = false; }
        else if (digit === '.') { if (!displayValue.includes('.')) displayValue += digit; }
        else if (displayValue === '0') displayValue = digit;
        else displayValue += digit;
    }

    function calculate(first, second, op) {
        first = parseFloat(first); second = parseFloat(second);
        if (isNaN(first) || isNaN(second)) return second;

        let r;
        switch (op) {
            case 'add': r = first + second; break;
            case 'subtract': r = first - second; break;
            case 'multiply': r = first * second; break;
            case 'divide': if (second === 0) { isErrorState = true; return 'Error: Divide by Zero'; }
                           r = first / second; break;
            case 'pow': r = Math.pow(first, second); break;
            default: return second;
        }
        return parseFloat(r.toFixed(10));
    }

    function getSymbol(op) {
        return { add: '+', subtract: '-', multiply: '×', divide: '÷', pow: '^' }[op] || '';
    }

    function handleScientific(func) {
        if (isErrorState) clearAll();
        let v = parseFloat(displayValue);
        if (isNaN(v)) return;
        let result;

        switch (func) {
            case 'sin': case 'cos': case 'tan':
                result = Math[func](v * Math.PI / 180);
                historyText = `${func}(${v}°)`; break;
            case 'log':
                if (v <= 0) return error("Error: Invalid Input");
                result = Math.log10(v); historyText = `log(${v})`; break;
            case 'sqrt':
                if (v < 0) return error("Error: Complex Result");
                result = Math.sqrt(v); historyText = `√(${v})`; break;
            case 'pi': result = Math.PI; historyText = 'π'; break;
        }

        displayValue = String(parseFloat(result.toFixed(10)));
        historyText += ` = ${displayValue}`;
        firstOperand = parseFloat(displayValue);
        waitingForSecondOperand = true;
    }

    const error = msg => { isErrorState = true; displayValue = msg; };

    function handleOperator(next) {
        if (isErrorState) clearAll();
        const value = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            operator = next;
            historyText = historyText.slice(0, -1) + getSymbol(next);
            return;
        }

        if (firstOperand == null) firstOperand = value;
        else if (operator) {
            const r = calculate(firstOperand, value, operator);
            if (isErrorState) return displayValue = r;
            displayValue = String(r); firstOperand = r;
        }

        waitingForSecondOperand = true;
        operator = next;
        historyText = `${firstOperand} ${getSymbol(next)}`;
    }

    buttons.addEventListener('click', e => {
        const btn = e.target; if (!btn.matches('button')) return;
        const action = btn.dataset.action; const text = btn.textContent;

        if (btn.classList.contains('number') || btn.classList.contains('decimal'))
            inputDigit(text);
        else if (btn.classList.contains('func'))
            handleScientific(action);
        else if (btn.classList.contains('operator')) {
            if (action === 'clear') clearAll();
            else if (action === 'sign') displayValue = String(-parseFloat(displayValue));
            else if (action === 'backspace') displayValue = displayValue.slice(0, -1) || '0';
            else handleOperator(action);
        }
        else if (action === 'calculate') {
            if (operator && firstOperand != null && !isErrorState) {
                const v = parseFloat(displayValue);
                historyText += ` ${v} =`;
                const r = calculate(firstOperand, v, operator);
                if (isErrorState) return displayValue = r, clearAll();
                displayValue = String(r);
                firstOperand = r; operator = null; waitingForSecondOperand = true;
            } else if (isErrorState) clearAll();
        }
        updateDisplay();
    });

    updateDisplay();
});