var call = {
    cleanArray: function(array){

        var tmpString = array.toString().replace(/\s/g, ',');
        var tmpArray = [];

        array = tmpString.split(',');

        array.forEach(function(elem, ind, arr){
            if(elem.length == 17){
                elem = {mac: elem};
                tmpArray.push(elem);
            }
        });

        array = tmpArray;
        tmpArray = [];

        array.push({mac: 'zzzzzzzzzzzzzzz'});

        array.sort().reduce(function(prev, curr, index, array){
            prev = array[index -1];

            if(prev.mac != curr.mac){
                tmpArray.push(prev);
            }

        });

        //tmp.forEach(function(elem, index, array){
        //    elem = {mac: elem};
        //    x.push(elem);
        //});

        array = tmpArray;

        return array;
    }
};

module.exports = call;