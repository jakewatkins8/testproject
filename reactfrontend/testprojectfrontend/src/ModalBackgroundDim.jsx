
import "./ModalBackgroundDim.css";


const ModalBackgroundDim = (props) => { 


    const handleModalBgClicked = (event) => {

        props.onModalBgClicked();
        
    };

    return (<div onClick={handleModalBgClicked} className="modalBackgroundDimmer"></div>); 
};


export default ModalBackgroundDim;