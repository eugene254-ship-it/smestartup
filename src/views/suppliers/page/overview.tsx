import React from 'react';
import { Collapsable } from '../../../components/collapsable';
import { Tooltip } from '../../../components/tooltip';

interface IProps {
    isRegistered: boolean;
    established: number;
    companyType: string;
    description: string;
    beeLevel: string;
    moqNumber: number;
    quotation: string;
}

export const Overview = ({
    isRegistered,
    established,
    companyType,
    description,
    beeLevel,
    moqNumber,
    quotation,
}: IProps) => {
    const message = 'MOQ stands for Minimum Order Quantity. This suppliers requires that you order a specified minimum quantity.';
    return (
        <>
            <article className='supplier__infoContainer'>
                    <h4> description & info </h4>
                    <Collapsable end={300} className='supplier__description'>
                        {description}
                    </Collapsable>
            </article>
            <hr className='global' />
            <section className='supplier__listContainer'>
                <ul className='supplier__lists'>
                    <li>
                        <span> Type </span>
                        <span> {companyType} </span>
                    </li>
                    <li>
                        <span> Established </span>
                        <span> {established} </span>
                    </li>
                    <li>
                        <span> MOQ <Tooltip message={message} className='$1' /> </span>
                        <span> {moqNumber} </span>
                    </li>
                    <li>
                        <span> BEE Compliance </span>
                        <span> {beeLevel} </span>
                    </li>
                    <li>
                        <span> Quotation </span>
                        <span> {quotation} </span>
                    </li>
                    <li>
                        <span> Registered </span>
                        <span> {isRegistered ? 'Yes' : 'No'} </span>
                    </li>
                </ul>
            </section>
            <hr className='global' />
        </>
    );
};
