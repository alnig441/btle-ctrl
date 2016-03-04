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

    },

    addProfiles: function(array1, array2){
        var temp = [];

        array2.forEach(function(elem2, index2, arr2){

            array1.forEach(function(elem1, index1, arr1){
                var y = [];

                if(elem1.id === elem2.mac){
                    for(var prop in elem1){
                        var x = {};
                        if(prop !== 'id'){
                            x.name = prop;
                            x.value = elem1[prop];
                            y.push(x);
                        }
                    }
                    arr2[index2].profiles = y;
                    temp.push({device: arr2[index2]});
                }
            });

        });
        return temp;

    }
};

module.exports = call;