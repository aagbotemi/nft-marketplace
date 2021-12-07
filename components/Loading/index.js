import React from 'react';

const LoadingIndicator = () => {
    return (
        <div className="flex justify-center mt-7">
            <div className="lds-ring inline-block relative w-20 h-20">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default LoadingIndicator;