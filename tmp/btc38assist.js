// javascript:(function(){var jsCode=document.createElement("script");jsCode.setAttribute("src","http://wilsonwys.github.io/tmp/btc38assist.js");document.body.appendChild(jsCode);setInterval("updateMydata()",300)}());

function updateMydata() {
    //每个周期需要执行的任务
    getTradeInfo();
    showOrder();
    calculateTotal();
}

function calculateTotal() {
    //如果total表不存在则新建
    var myOrderTableTotal = document.getElementById("myOrderTableTotal");
    if ($("#myOrderTableTotal").length <= 0) {
        var table = '<table width="881" id="myOrderTableTotal" class="tableStyle1"><tr height="35"><th width="175">挂单时间</th><th width="108">挂单类型</th><th width="160">挂单均价(<span class="mkType">CNY</span>)</th><th width="160">挂单总量(<span class="coinName">EAC</span>)</th><th width="160">挂单总额(<span class="mkType">CNY</span>)</th><th width="118">操作</th></tr></table>';
        var tr = '<tr style="height: 35px;"><td>----</td><td>类型</td><td>挂单价格</td><td>挂单数量</td><td>挂单总额</td><td>----</td></tr>';
        $("#myOrderDiv").append(table);
        $("#myOrderTableTotal").append(tr);
        $("#myOrderTableTotal").append(tr);
        $("#myOrderTableTotal").append(tr);
        myOrderTableTotal = document.getElementById("myOrderTableTotal");
        myOrderTableTotal.rows[1].cells[1].innerHTML = '<font color = "green">买入</font>';
        myOrderTableTotal.rows[2].cells[1].innerHTML = '<font color = "red">卖出</font>';
        myOrderTableTotal.rows[3].cells[1].innerHTML = "合计";
    }
    //数据处理
    var myOrderTable = document.getElementById("myOrderTable");
    var myOrderTableRows = myOrderTable.rows.length;
    var totalBuyAmount = 0;
    var totalBuyCNY = 0;
    var totalSellAmount = 0;
    var totalSellCNY = 0;
    for (var i = 1; i < myOrderTableRows; i++) {
        var type = myOrderTable.rows[i].cells[1].innerText;
        if (type == "买入") {
            totalBuyAmount += parseFloat(myOrderTable.rows[i].cells[3].innerText, 10);
            totalBuyCNY += parseFloat(myOrderTable.rows[i].cells[4].innerText, 10);
        } else if (type == "卖出") {
            totalSellAmount += parseFloat(myOrderTable.rows[i].cells[3].innerText, 10);
            totalSellCNY += parseFloat(myOrderTable.rows[i].cells[4].innerText, 10);
        }
    }
    //数据更新
    //第2列
    if (totalBuyAmount == 0) {
        myOrderTableTotal.rows[1].cells[2].innerText = totalBuyCNY.toFixed(8);
    } else {
        myOrderTableTotal.rows[1].cells[2].innerText = (totalBuyCNY / totalBuyAmount).toFixed(8);
    }
    if (totalSellAmount == 0) {
        myOrderTableTotal.rows[2].cells[2].innerText = totalSellCNY.toFixed(8);
    } else {
        myOrderTableTotal.rows[2].cells[2].innerText = (totalSellCNY / totalSellAmount).toFixed(8);
    }
    myOrderTableTotal.rows[3].cells[2].innerText = '----';
    //第3列
    myOrderTableTotal.rows[1].cells[3].innerText = totalBuyAmount.toFixed(6);
    myOrderTableTotal.rows[2].cells[3].innerText = totalSellAmount.toFixed(6);
    myOrderTableTotal.rows[3].cells[3].innerText = (totalBuyAmount + totalSellAmount).toFixed(6);
    //第4列
    myOrderTableTotal.rows[1].cells[4].innerText = totalBuyCNY.toFixed(2);
    myOrderTableTotal.rows[2].cells[4].innerText = totalSellCNY.toFixed(2);
    myOrderTableTotal.rows[3].cells[4].innerText = (totalBuyCNY + totalSellCNY).toFixed(2);
}