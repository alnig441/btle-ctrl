var call = {
    cleanArray: function(array){

        array.push('zzzzzzzzzzzzzzz');

        var y = [];

        array.sort().reduce(function(prev, curr, index, array){
            prev = array[index -1];

            if(prev != curr){
                y.push(prev);
            }

        });

        return y;
    }
};

module.exports = call;