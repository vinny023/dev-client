export const syncCartFromDb = (db, dispatch, account_id) => {
    db.ref('customers/'+account_id).on('value', state => {
        dispatch({
            type: 'SYNC_CART',
            payload: state
        })
    })
}
        
        
    

