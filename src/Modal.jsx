
function Modal({showModal,setShowModal,children,addHandler}) {

  return (
    <div className={showModal ? "test-options":'hide'}>
    <div className="header">

        <div>options</div>
        <div>
          <button onClick={addHandler}>+</button>
          <button onClick={()=>setShowModal(false)}>x</button>
          </div>
    </div>
    <div className="body">
      {children}
   
    </div>
</div>
  )
} 

export default Modal