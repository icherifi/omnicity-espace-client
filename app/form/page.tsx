import React from 'react';
import SideNavigation from './SideNavigation';
import PropertySelector from './PropertySelector';
import InputField from './InputField';
import IncomeSlider from './IncomeSlider';
import HouseholdSizeSelector from './HouseHoldSizeSelector';

const Form = () => {
    return (
        <div className="flex m-5">
            <div className="flex w-52 h-150">
                <SideNavigation />
            </div>
            <div className="flex flex-col m-10 p-5 gap-2">
                <PropertySelector />
                <div className="flex gap-5 items-start self-stretch">
                    <InputField label="Été construite" type="date" defaultValue="1956-05-12" />
                    <InputField label="Adresse" type="text" defaultValue="30, Boulevard Mcdonald" />
                    <InputField label="Surface habitable (m²)" type="number" defaultValue="95" />
                </div>
                <div className="flex gap-4">
                </div>
                <button className="justify-center self-end px-12 py-4 mt-11 text-xl font-semibold tracking-tight leading-6 text-center whitespace-nowrap bg-blue-300 rounded-2xl text-slate-100 max-md:px-5 max-md:mt-10">
                    Valider
                </button>
            </div>

        </div>
    );
};

export default Form;