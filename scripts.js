
//objeto Modal
const modal = {
    
    
    //Funcionalidade abrir
    open(){
        
        document.querySelector('.modal-overlay')
        .classList.add('active')  
    },


    //Funcionalidade fechar
    close() {
       
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
}

const Storage = {
    
    //pegar as informações
    get () {
        return JSON.parse(localStorage.getItem("guardar")) || []
        
},
    
    //guardar as informações
    set (transactions) {
        localStorage.setItem("guardar" , JSON.stringify(transactions))
    }

}

//Objeto Balance - é equivalente ao objeto Transaction da app do Maik
const Balance = {
    
    all: Storage.get(),


    add(transaction) {
        Balance.all.push(transaction)
        app.reload()
    },

    remove(index) {
        Balance.all.splice(index , 1)
        app.reload()
    },

    incomes() {
        let income=0
        Balance.all.forEach(transaction => {

            if (transaction.amount > 0) {
                income = income + transaction.amount;
            }
        })

        return income;
    },

    
    
    expense() {
        let expense=0
        Balance.all.forEach(transaction=> {
            if (transaction.amount < 0) {
                expense = expense + transaction.amount;
            }
        })
        return expense
    },

    
    
    totals() {
      return Balance.incomes() + Balance.expense()
    },

    
    
    updateBalance(valor) {
        document
            .getElementById('incomeDisplay')
            .innerHTML=utils.formatar_moeda(Balance.incomes())
        
        document
            .getElementById('expenseDisplay')
            .innerHTML=utils.formatar_moeda(Balance.expense())
        
        document
            .getElementById('totalDisplay')
            .innerHTML=utils.formatar_moeda(Balance.totals())
    },

    
}


//objeto Uteis                    
const utils = {
    
    formatAmount(value) {
        
        
        value=Number(value.replace(/\,\./g, ""))*100


        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    //função formatar moeda
    formatar_moeda (value) {
        const signal = Number(value) < 0 ? "-":""
        value = String(value).replace(/\D/g,"")
        value = Number(value)/100
        
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
            //transformando em moeda brasileira

        })

        return signal + value
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields () {
        const {description, amount, date} = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues()
        amount=utils.formatAmount(amount)
        date=date

        return {
            description,
            amount,
            date
        }
    },

    clearFields(){

        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        
        
        try {
            
            //verificar se todas as informações foram preenchidas
            Form.validateFields()
            //formatar os dados para salvar
            const transaction = Form.formatValues()
            //salva os dados que estão na variável acima que acabou de criar
            Balance.add(transaction)
            //apagar os dados do formulário
            Form.clearFields()
            //fechar o modal
            modal.close()
            
            //dar um reload na aplicação, mas esta parte ja esta dentro da função Balance.add() ali em cima.            

        } catch (error) {

            alert(error.message)
        }
    },
}


//objeto DOM
const DOM = {


    //Caracterísitca/Propriedade linha
    linhas_tabela: document.querySelector('#data-table tbody'),


    //Funcão criar HTMl da tabela e colocar os dados da lista, via js
    html_model(value,index)
                {

                    const cssclass=value.amount > 0 ? "positive":"negative"
                    
                    //criou a variável cssclass
                    // se o valor for maior que zero, recebe a classe positiva, se nao, recebe a classe negativa. A classe positiva tem a cor verde no css e a classe negative tem a cor vermelha

                    
                    
                    const amount = utils.formatar_moeda(value.amount)
                   

                    const recebe_html = `
            
                        <td class="description">${value.description}</td>
                        
                        <td class="${cssclass}">${amount}</td>
                        
                        <td class="date">${value.date}</td>

                        <td>
                            <img onclick="Balance.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
                        </td>
            
                    `
                    return recebe_html 
                },
        
                
        //Funcão cria elemento tr via document, e coloca o modelo criado na função acima dento deste elemento
        addTransaction(value,index) 
                
                {                   
                    const tr = document.createElement('tr')
                 //dentro do html ele vai executar a função html_model
                    tr.innerHTML = DOM.html_model(value,index)
                    tr.dataset.index = index
                    
                    DOM.linhas_tabela.appendChild(tr)
                },

        
        clearTransactions() {
            DOM.linhas_tabela.innerHTML=""
        }

            }

//Objeto que cria o fluxo de execução
const app = {
    init() {

        Balance.all.forEach(DOM.addTransaction)
        
        Balance.updateBalance()

        Storage.set(Balance.all)
        
    },

    reload() {
        DOM.clearTransactions()
        app.init()
        
    },
}
 

// FLUXO DE EXECUCAO
app.init()
//Balance.remove()

