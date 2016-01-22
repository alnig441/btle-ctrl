var call = {
    cleanArray: function(array){
        var y = [];
        var tmp = [];
        var x = array.toString().replace(/\s/g, ',');

        array = x.split(',');

        array.forEach(function(elem, ind, arr){
            if(elem.length == 17){
                tmp.push(elem);
            }
        });

        array = tmp;

        array.push('zzzzzzzzzzzzzzz');

        array.sort().reduce(function(prev, curr, index, array){
            prev = array[index -1];

            if(prev != curr){
                y.push(prev);
            }

        });

        array = y;

        return array;
    }
};

module.exports = call;