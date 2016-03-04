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
        console.log('in addProfiles: ');

        array2.forEach(function(elem2, index2, arr2){

            array1.forEach(function(elem1, index1, arr1){
                if(elem1.id === elem2.mac){
                    var x = {};
                    for(var prop in elem1){
                        if(prop !== 'id'){
                            x[prop] = elem1[prop];

                        }
                    }
                    arr2[index2].profiles = x;
                    temp.push({device: arr2[index2]});
                }
            });

        });
        return temp;

    }
};

module.exports = call;