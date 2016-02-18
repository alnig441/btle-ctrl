var call = {
    cleanArray: function(array){

        var tmpString = array.toString().replace(/\s/g, ',');
        var tmpArray = [];

        array = tmpString.split(',');

        array.forEach(function(elem, ind, arr){
            if(elem.length == 17){
                tmpArray.push(elem);
            }
        });

        array = tmpArray;
        tmpArray = [];

        array.push({mac: 'zzzzzzzzzzzzzzz'});

        array.sort().reduce(function(prev, curr, index, array){
            prev = array[index -1];

            if(prev != curr){
                prev = {mac: prev};
                tmpArray.push(prev);
            }

        });

        array = tmpArray;

        return array;
    },

    buildGattargs: function(mac, arg){
        gattArgs = [
            '-i',
            'hci1',
            '-b',
            mac,
            '--char-write',
            '-a',
            '0x0028',
            '-n',
            arg
        ];

        return gattArgs;

    }
};

module.exports = call;