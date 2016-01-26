var call = {
    cleanArray: function(array){
        var x = array.toString().replace(/\s/g, ',');

        array = x.split(',');
        x = [];

        array.forEach(function(elem, ind, arr){
            if(elem.length == 17){
                elem = {mac: elem};
                x.push(elem);
            }
        });

        array = x;
        x = [];

        array.push({mac: 'zzzzzzzzzzzzzzz'});

        array.sort().reduce(function(prev, curr, index, array){
            prev = array[index -1];

            if(prev.mac != curr.mac){
                x.push(prev);
            }

        });

        array = x;

        return array;
    }
};

module.exports = call;