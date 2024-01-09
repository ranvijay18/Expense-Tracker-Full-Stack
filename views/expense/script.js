const form = document.getElementById('form');
const list = document.getElementById('expense');
const extra = document.getElementById('extra');
const premiumBuy = document.getElementById('premium');
const premiumFeatures = document.getElementById('premium-features');
const page = document.getElementById('page');
const rowPage = document.getElementById('row');


let token;
let row = 5;

rowPage.addEventListener('change' , (e) => {
  e.preventDefault();

  row = document.getElementById('row').value;

  localStorage.setItem("row", row);
})

form.addEventListener('submit', store);

window.addEventListener('DOMContentLoaded', async () => {
  const rows = localStorage.getItem("row")
  try {
  const page = 1;
    token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/expense/${page}`, { headers: { 'Authorization': token, "row":rows } });

    console.log(res);
    const data = res.data.detail;
    const isPremium = res.data.user;
    const currentPage = res.data.currentPage;
    const hasNextPage = res.data.hasNextPage;
    const nextPage = res.data.nextPage;
    const hasPreviousPage = res.data.hasPreviousPage;
    const lastPage = res.data.lastPage;

    if(isPremium === false){
        var but = document.createElement('button');
        but.id = "rzp-button1";
        but.textContent = "Buy Premium";
        premiumBuy.appendChild(but);

        var scriptRzp = document.createElement('script');
        scriptRzp.src = "https://checkout.razorpay.com/v1/checkout.js";
        premiumBuy.appendChild(scriptRzp);

        document.getElementById("rzp-button1").addEventListener('click' , async (e) => {
          e.preventDefault();
          const token = localStorage.getItem("token")
          const res = await axios.get("http://localhost:5000/premium" , {headers : {"Authorization" : token}});
        console.log(res.data.order.id);
      
        var options = {
          "key" : res.data.key_id,
          "order_id" : res.data.order.id,
          "handler": async function (res){
            await axios.post('http://localhost:5000/premium/updatePurchase', {
              order_id: options.order_id,
              payment_id : res.razorpay_payment_id
            } , {headers: {"Authorization" : token}})
      
            alert('You are now premium now');

            premiumBuy.textContent ="";

            var but = document.createElement('button');
        but.id = "btn";
        but.textContent = "Premium User";
        premiumBuy.appendChild(but);

        var lead = document.createElement('button');
        lead.id = "leaderboard";
        lead.textContent = "Leaderboard";
        premiumFeatures.appendChild(lead);

        var report = document.createElement('button');
        report.id = "reports";
        report.textContent = "Reports";
        premiumFeatures.appendChild(report);


        document.getElementById('leaderboard').addEventListener('click' , () => {
          window.location.href = `../leaderboard/lead.html`;
          
        })

        document.getElementById('reports').addEventListener('click' , () => {
          window.location.href = '../Report/report.html';
          
        })
          }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();
      
        rzp1.on('payment.failed', function(res){
          console.log(res);
          alert('Something gone wrong')
        });
      })
    }else{

      var but = document.createElement('button');
        but.id = "btn";
        but.textContent = "Premium User";
        premiumBuy.appendChild(but);

        var lead = document.createElement('button');
        lead.id = "leaderboard";
        lead.textContent = "Leaderboard";
        premiumFeatures.appendChild(lead);

        var report = document.createElement('button');
        report.id = "reports";
        report.textContent = "Reports";
        premiumFeatures.appendChild(report);


        document.getElementById('leaderboard').addEventListener('click' , () => {
          window.location.href = ('../leaderboard/lead.html');
        })

        document.getElementById('reports').addEventListener('click' , () => {
          window.location.href = '../Report/report.html';
          
        })

    }

    
    data.forEach(ele => {
      showData(ele);
    });
    const totalAmount = res.data.total;
    const total = res.data.totalItems;
    showExtra(totalAmount, total);
    showPage(currentPage,hasNextPage,hasPreviousPage,nextPage,lastPage);
  }
  catch (error) {
    console.log(error);
  }
});



async function store(e) {

  try {
    e.preventDefault();

    const amount = e.target.amount.value;
    const des = e.target.des.value;
    const cat = e.target.cat.value;


    const obj = {
      amount,
      des,
      cat
    }

    const res = await axios.post('http://localhost:5000/expense', obj)
    window.location.reload();
    const data = res.data;
    showData(data)


    while (extra.hasChildNodes()) {
      extra.removeChild(extra.firstChild)
    };
    showExtra(totalAmount, avgAmount);
  }
  catch (error) {
    console.log(error);
  }

}



showExtra = (totalAmount, total) => {

  let avg = totalAmount/total;
  let newAvg = avg.toFixed(2);

  var h4 = document.createElement('h4');
  h4.className = 'tamount'
  h4.appendChild(document.createTextNode("₹ " + totalAmount));
  extra.appendChild(h4);

  var h4 = document.createElement('h4');
  h4.className = 'aamount'
  h4.appendChild(document.createTextNode("₹ " + newAvg));
  extra.appendChild(h4);

}


showData = (res) => {

  var ul = document.createElement('ul');

  var li = document.createElement('li');
  li.className = "head-amount";
  var details = res['amount'];
  li.appendChild(document.createTextNode("₹ " + details));
  ul.appendChild(li);
  var li = document.createElement('li');
  li.className = "head-des";
  var details = res['description']
  li.appendChild(document.createTextNode(details));
  ul.appendChild(li);
  var li = document.createElement('li');
  li.className = "head-cat";
  var details = res['category'];
  li.appendChild(document.createTextNode(details));
  ul.appendChild(li);

  var editBtn = document.createElement('button');
  editBtn.id = `${res.id}`;
  editBtn.className = "edit btn btn-outline-success";
  editBtn.appendChild(document.createTextNode("Edit"));
  ul.appendChild(editBtn);

  var deleteBtn = document.createElement('button');
  deleteBtn.id = `${res.id}`;
  deleteBtn.className = "del btn btn-outline-danger";
  deleteBtn.appendChild(document.createTextNode("Delete"));
  ul.appendChild(deleteBtn);

  list.appendChild(ul);


  editBtn.addEventListener('click', async (e) => {

    try {
      const expenseId = e.target.id;

      list.removeChild(ul);

      const res = await axios.get('http://localhost:5000/expense/edit/' + expenseId)


      const editExpense = res.data.editExpense;
      const totalAmount = res.data.total;
      const total = res.data.totalItems;
      console.log(editExpense);
      document.getElementById('amount').value = editExpense['amount'];
      document.getElementById('des').value = editExpense['description'];
      document.getElementById('cat').value = editExpense['category'];

      while (extra.hasChildNodes()) {
        extra.removeChild(extra.firstChild)
      };
      showExtra(totalAmount, total);
    }
    catch (error) {
      console.log(error);
    }
  })



  deleteBtn.addEventListener('click', async (e) => {

    try {
      const expenseId = e.target.id;


      list.removeChild(ul);



      const res = await axios.get('http://localhost:5000/expense/delete/' + expenseId)

      if (res.data.status === true) {

        const delExpense = res.data.delExpense;
        console.log("Expense Data Deleted!!");

        const totalAmount = res.data.total;
        const total = res.data.totalItems;

        while (extra.hasChildNodes()) {
          extra.removeChild(extra.firstChild)
        };
        showExtra(totalAmount, total);
      }else{
        console.log(res.data.message);
      }
    }
    catch (error) {
      console.log(error);
    }

  })

}

function showPage(currentPage,hasNextPage,hasPreviousPage,nextPage,lastPage){

  if(hasPreviousPage){
  var prevBtn = document.createElement('button');
  prevBtn.className = "prev";
  prevBtn.id = "prev";
  const prevPage = +currentPage-1;
  prevBtn.textContent = prevPage;
  page.appendChild(prevBtn);

  document.getElementById('prev').addEventListener('click' , async () => {
    const row = localStorage.getItem("row");
    const resPrev = await axios.get(`http://localhost:5000/expense/${prevPage}`, { headers: { 'Authorization': token, "row":row } })
   
    const prevPageData = resPrev.data.detail;
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild)
    };
    prevPageData.forEach(ele => {
      showData(ele);
    })
   
    const paging = resPrev.data;
    while (page.hasChildNodes()) {
      page.removeChild(page.firstChild)
    };
    showPage(paging.currentPage,paging.hasNextPage,paging.hasPreviousPage,paging.nextPage,paging.lastPage);
  })

  }


  var currBtn = document.createElement('button');
  currBtn.className = "curr";
  currBtn.id="curr";
  currBtn.textContent = currentPage;
  page.appendChild(currBtn);

  if(hasNextPage){
    var nextBtn = document.createElement('button');
  nextBtn.className = "prev";
  nextBtn.id = "next";
  nextBtn.textContent = nextPage;
  page.appendChild(nextBtn);

  document.getElementById('next').addEventListener('click' , async () => {
    const row = localStorage.getItem("row");
    const resNext = await axios.get(`http://localhost:5000/expense/${nextPage}`, { headers: { 'Authorization': token , "row":row} })
   
    const nextPageData = resNext.data.detail;
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild)
    };

    nextPageData.forEach(ele => {
      showData(ele);
    })
    
    const paging = resNext.data;
    while (page.hasChildNodes()) {
      page.removeChild(page.firstChild)
    };
    showPage(paging.currentPage,paging.hasNextPage,paging.hasPreviousPage,paging.nextPage,paging.lastPage);
  })

  }
}






