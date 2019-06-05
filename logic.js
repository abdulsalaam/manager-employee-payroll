
/*
* Sample transcation processor function
* @param {test.FundTransfer} ft
* @transaction
*/
async function  FundTransfer(ft)
{
    let WalletRegistry = await getAssetRegistry('test.Wallet');
    let ManagerRegistry = await getParticipantRegistry('test.Manager');
    let FundRegistry = await getAssetRegistry('test.Funds');
    let WalletIdExist = await WalletRegistry.exists(ft.manager.wallet.walletId);
    let ManagerIdExist = await ManagerRegistry.exists(ft.manager.managerId);
    if(WalletIdExist && ManagerIdExist){
        if(ft.manager.wallet.balance > ft.amount){
            ft.fund.balance += ft.amount
            ft.manager.wallet.balance -=ft.amount
            
            await WalletRegistry.update(ft.manager.wallet);  
            await FundRegistry.update(ft.fund);
        }
        else{
        throw new Error("Insufficient balance in managers account")
        }
    }
    else{
        throw new Error('Either Wallet Or Manager Doesnot Exist');
    }   
}
/*
* Sample transcation processor function
* @param {test.EmployeeSalary} es
* @transaction
*/

function EmployeeSalary(es)
{
    if(es.employee.salaryStatus == "UNPAID")
    {
        if(es.fund.balance > es.employee.salary)
        {
            es.fund.balance -= es.employee.salary
            es.employee.wallet.balance += es.employee.salary
            
            es.employee.salaryStatus = "PAID"

            return getAssetRegistry('test.Funds')
            .then(function(accRegistry){
                return accRegistry.update(es.fund);
            }).then(function(){
                return getAssetRegistry('test.Wallet');
            }).then(function(accRegistry){
                return accRegistry.update(es.employee.wallet);
            }).then(function(){
                return getParticipantRegistry('test.Employee');
            }).then(function(participantRegistry){
                return participantRegistry.update(es.employee);
            });
        }
        else{
            throw new Error("Fund Balance insufficient")
        }
        
    }
    else{
        throw new Error("You are already paid")
    }
}
