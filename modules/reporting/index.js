const Controller = require('./reporting.controller');
const Validator = require('./reporting.validator');
const { AbstractRouter } = require('@rumsan/core/abstract');
const { PERMISSIONS } = require('../../constants');

module.exports = class extends AbstractRouter {
  constructor(options = {}) {
    options.name = options.name || 'reports';
    options.controller = new Controller(options);
    options.validator = new Validator(options);
    super(options);
  }
  routes = {
    // Demographics
    getBeneficiaryDemographicsSummary: {
      method: 'GET',
      path: '/dashboard/summary',
      description: 'Get Beneficiary Demographics Summary',
      // permissions : [PERMISSIONS.REPORT_READ]
    },

    // #region Piechart
    getBeneficiaryPiechartByProject: {
      method: 'GET',
      path: '/piechart/{type}',
      description: 'Get report piechart',
      permissions: [PERMISSIONS.REPORT_READ],
    },
    //  #endregion

    //beneficiaryPerVillage
    getBeneficiaryPerVillage: {
      method: 'GET',
      path: '/beneficiary/village/{type}',
      description: 'Get get Beneficiary Per Village',
      permissions: [PERMISSIONS.REPORT_READ],
    },

    getGeoMapData: {
      method: 'GET',
      path: '/beneficiaries/geo',
      description: 'Get geo location of Beneficiary',
      permissions: [PERMISSIONS.REPORT_READ],
    },
    getBeneficaryClaimsByVillage: {
      method: 'GET',
      path: '/beneficiaries/claim-distribution-by-village',
      description: 'Get geo location of Beneficiary',
      permissions: [PERMISSIONS.REPORT_READ],
    },
    getBarChartDataByTypeInVillages: {
      method: 'GET',
      path: '/beneficiaries/claim-distribution-by-type',
      description: 'Get geo location of Beneficiary',
      permissions: [PERMISSIONS.REPORT_READ],
    },
  };
};
