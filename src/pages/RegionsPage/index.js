import React from 'react';
import {useTranslation} from "react-i18next";

const RegionsPage = () => {
    const { t } = useTranslation()
    return (
        <div>
            {t("sidebar.regions")}
        </div>
    );
};

export default RegionsPage;
