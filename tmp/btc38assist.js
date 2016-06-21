// javascript:(function(){var jsCode=document.createElement("script");jsCode.setAttribute("src","http://wilsonwys.github.io/tmp/btc38assist.js");document.body.appendChild(jsCode);setInterval("updateMydata()",300)}());

function updateMydata()
{
  //每个周期需要执行的任务
  getTradeInfo();
  showOrder();
  calculateTotal();
}

function calculateTotal()
{
  //如果total表不存在则新建
  if ($("#myOrderTableTotal").length <= 0)
  {
    var table = '<table width="881" id="myOrderTableTotal" class="tableStyle1"><tr height="35"><th width="175">挂单时间</th><th width="108">挂单类型</th><th width="160">挂单价格(<span class="mkType">CNY</span>)</th><th width="160">挂单数量(<span class="coinName">EAC</span>)</th><th width="160">挂单总额(<span class="mkType">CNY</span>)</th><th width="118">操作</th></tr></table>';
    var tr = '<tr style="height: 35px;"><td>挂单时间</td><td>类型</td><td>挂单价格</td><td>挂单数量</td><td>挂单总额</td><td>操作</td></tr>';
    $("#myOrderDiv").append(table);
    $("#myOrderTableTotal").append(tr);
    $("#myOrderTableTotal").append(tr);
    $("#myOrderTableTotal").append(tr);
    $("#myOrderTableTotal").rows[1].cells[1].innerHTML = "买入";
    $("#myOrderTableTotal").rows[2].cells[1].innerHTML = "卖出";
    $("#myOrderTableTotal").rows[3].cells[1].innerHTML = "合计";
  }

  //数据处理
  var myOrderTableTotal = document.getElementById("myOrderTableTotal");
  myOrderTableTotal.rows[1].cells[1].innerHTML = "买入";
  myOrderTableTotal.rows[2].cells[1].innerHTML = "卖出";
  myOrderTableTotal.rows[3].cells[1].innerHTML = "合计";

  var myOrderTable = document.getElementById("myOrderTable");
  var myOrderTableRows = myOrderTable.rows.length;
  var totalBuyCNY = 0;
  var totalSellCNY = 0;
  for (var i = 1; i < myOrderTableRows; i++)
  {
    var type = myOrderTable.rows[i].cells[1].innerText;
    if (type == "买入")
    {
      totalBuyCNY += parseFloat(myOrderTable.rows[i].cells[4].innerHTML, 10);
    }
    else if (type == "卖出")
    {
      totalSellCNY += parseFloat(myOrderTable.rows[i].cells[4].innerHTML, 10);
    }
  }
  //数据更新
  myOrderTableTotal.rows[1].cells[4].innerHTML = totalBuyCNY;
  myOrderTableTotal.rows[2].cells[4].innerHTML = totalSellCNY;
  myOrderTableTotal.rows[3].cells[4].innerHTML = totalBuyCNY + totalSellCNY;
}