const url = 'http://localhost:3000'

const Amount = document.querySelector('#amount');
const Expense = document.querySelector('#expense');
const Description = document.querySelector('#description');
const Category  = document.querySelector('#category');

async function getExpense(id){
    try{
        const token = localStorage.getItem("token")
        const response = await axios.get(`${url}/expense/${id}`,{headers : { Authorization : token}});
        const expense = response.data;
        return expense
    }
    catch(err){ 
        console.log(err);
    }
}

async function postExpense(obj){
    try{
        const token = localStorage.getItem("token")
        const response = await axios.post(`${url}/expense`, obj,{headers : { Authorization : token}})
        showOutput(response.data)
    }
    catch(err){
        console.log(err);
    }
}

async function deleteExpense(id){
    try{
        const token = localStorage.getItem("token")
        document.getElementById(id).remove()
        const response = await axios.delete(`${url}/expense/${id}`,{headers : { "Authorization" : token}});
    }
    catch(err){
        console.log(err);
    }
}

async function editExpense(expenseId, newExpense){
    try{
        const token = localStorage.getItem("token")
        const response = await axios.put(`${url}/expense/${expenseId}`,newExpense, {headers : { Authorization : token}})
        const expense = response.data;
        document.getElementById('expenseId').value = ''
        showOutput(expense)
    }
    catch(err){
        console.log(err);
    }
}

function showOutput(obj){
    const tr = document.createElement('tr');
    tr.title = obj.description;
    tr.id = obj.id

    tr.innerHTML = `<td class = "text-center">${obj.expense}</td>
    <td class = "text-center">${obj.category}</td>
    <td >
      ${obj.amount}
      <div class="btn-group float-end me-3">
        <button type="button" class="btn btn-primary btn-sm" id = "edit">edit</button>
        <button type="button" class="btn btn-danger btn-sm" id = "delete">X</button>
      </div>
    </td>`
    document.querySelector('tbody').append(tr)
}

document.addEventListener("DOMContentLoaded", async ()=> {

    const token = localStorage.getItem("token")
    const response = await axios.get(`${url}/expenses`,{ headers : { "Authorization" : token}})
    const expenses = response.data;
    expenses.forEach(expense => {
        showOutput(expense)
    });
    
    document.querySelector('form').onsubmit = async (e) => {
        e.preventDefault()
        const amount =  Amount.value;
        const expense = Expense.value;
        const description = Description.value;
        const category = Category.value;
        const newExpense = {
            amount : amount,
            expense : expense,
            description : description,
            category : category
        }
        const expenseId = document.querySelector('#expenseId').value
        if(expenseId == ''){
            postExpense(newExpense)
        }else{
            editExpense(expenseId, newExpense)
        }
        Amount.value = ""
        Expense.value = ""
        Description.value = ""
        Category.value = ""
    }

    document.querySelector("tbody").onclick = async (e) => {
        if(e.target.id == 'delete'){
            const expenseId = e.target.parentNode.parentNode.parentNode.id;
            deleteExpense(expenseId)
        }
        else if (e.target.id == "edit"){
            const expenseId = e.target.parentNode.parentNode.parentNode.id;
            const expense = await getExpense(expenseId)
            Amount.value = expense.amount;
            Expense.value = expense.expense;
            Description.value = expense.description;
            Category.value = expense.category
            document.querySelector('#expenseId').value = expense.id
            document.getElementById(expenseId).remove()
        }
    }



})