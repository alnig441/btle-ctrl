var call = {
    cleanArray: function(array){

        var compArray = array.sort();


        console.log(array, array.length);

        array.reduce(function(previousValue, currentValue, currentIndex){
            if(previousValue !== currentValue){
                console.log(currentIndex);
                //compArray.shift();
                compArray.splice(currentIndex -1, 1);
                console.log(compArray.length);
            }
        }, compArray[0]);

        return compArray;

    }
};

module.exports = call;