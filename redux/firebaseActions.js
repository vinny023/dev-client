export const syncCartFromDb = (db, dispatch, accountId) => {
    db.ref('customers/'+accountId).on('value', state => {
        dispatch({
            type: 'SYNC_CART',
            payload: state
        })
    })
}
        
        
    

