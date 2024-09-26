import supabase from 'supabase'

async function checkInstallmentByAddress(address_param) {
    let { data, error } = await supabase
        .rpc('check_installment_by_address', {
            address_param
        })
    if (error) { alert(error) } else {
        return data
    }
}
async function checkInstallmentByBlockId(block_id_param){
    let { data, error } = await supabase
        .rpc('check_installment_by_block_id', {
            block_id_param
        })
    if (error) { alert(error) } else {
        return data
    }
}

export { checkInstallmentByAddress, checkInstallmentByBlockId }

