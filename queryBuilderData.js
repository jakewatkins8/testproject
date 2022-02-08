
const queryBuilderData = () => {

            let attrs_for_models = {
                'User': {
                    'userName': 'userName'
                },
                'Note': {
                    'author': 'author',
                    'content': 'content',
                    'dateCreated': 'dateCreated',
                    'dateModified': 'dateModified'
                }
            };

            // attribute-operator-value-(chaining_op)

            const ops = {
                $eq: '$eq',
                $gt: '$gt',
                $gte: '$gte',
                $lt: '$lt',
                $lte: '$lte',
                $ne: '$ne',
                contains: function() {

                }
            };

            const logical_ops = {
                $and: '$and',
                $or: '$or'
            };

            if (op === ops[contains]) {
                let obj = {'attr': '/searchval/'}  
            }

};

// TODO fix this export:
// export {attrs_for_models, ops, logical_ops};
