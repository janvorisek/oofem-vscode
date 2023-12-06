export const oofemParamTypes = {
  'rn': {
    // real number (double)
    validator: (val: string) => {
      return !isNaN(parseFloat(val));
    }
  },
  'in': {
    // int
    validator: (val: string) => {
      const dbl = parseFloat(val);
      return !isNaN(dbl) && Number.isInteger(dbl);
    }
  },
  'ra': {
    // int array
    validator: (val: string) => {
      const items = val.split(' ');

      if (items.length === 0) return false;
      if (!oofemParamTypes.in.validator(items[0])) return false;

      const len = parseInt(items[0]);

      if (items.length - 1 !== len) {
        return false;
      }

      for (let i = 1; i < items.length; i++) {
        if (!oofemParamTypes.rn.validator(items[i])) return false;
      }

      return true;
    }
  },
  'ia': {
    // int array
    validator: (val: string) => {
      const items = val.split(' ');

      if (items.length === 0) return false;
      if (!oofemParamTypes.in.validator(items[0])) return false;

      const len = parseInt(items[0]);

      if (items.length - 1 !== len) {
        return false;
      }

      for (let i = 1; i < items.length; i++) {
        if (!oofemParamTypes.in.validator(items[i])) return false;
      }

      return true;
    }
  },
  'ch': {
    // character
    validator: (val: string) => {
      let regex = /^[a-zA-Z]+$/;

      // single a-z or A-Z character
      if (val.length === 1 && regex.test(val)) {
        return true;
      } else if (oofemParamTypes.in.validator(val)) {  // Check if it's a valid
                                                       // ASCII code
        return true;
      }

      return false;
    }
  }
}