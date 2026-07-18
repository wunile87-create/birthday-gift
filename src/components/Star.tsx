type StarProps = {

    left:number;

    top:number;

    size:number;

    color:string;

    type:string;

    delay:number;

    duration:number;

};

function Star({

    left,
    top,
    size,
    color,
    type,
    delay,
    duration,

}:StarProps){

    return(

        <div

            className={`star ${type}`}

            style={{

                left,

                top,

                width:size,

                height:size,

                background:type==="cross"?"transparent":color,

                animationDelay:`${delay}s`,

                animationDuration:`${duration}s`,

                color,

                fontSize:size*2

            }}

        >

            {type==="cross"?"✦":""}

        </div>

    );

}

export default Star;