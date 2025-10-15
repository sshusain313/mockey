'use client';

import React, { useEffect } from 'react';
import { jsPDF } from 'jspdf';

interface InvoiceGeneratorProps {
  paymentData: {
    paymentId: string;
    planName: string;
    amount: number;
    date?: string;
    customerName?: string;
    customerEmail?: string;
    isLifetime?: boolean;
  };
  autoDownload?: boolean;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ 
  paymentData, 
  autoDownload = false 
}) => {
  const {
    paymentId,
    planName,
    amount,
    date = new Date().toLocaleDateString(),
    customerName = 'Customer',
    customerEmail = 'customer@example.com',
    isLifetime = false,
  } = paymentData;

  // Generate and download PDF
  const generatePDF = () => {
    try {
      // Create new jsPDF instance
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: `Invoice-${paymentId}`,
        subject: `Payment for ${planName} Plan`,
        author: 'Mockey',
        creator: 'Mockey Invoice Generator'
      });
      
      // Add logo/header
      doc.setFontSize(22);
      doc.setTextColor(33, 33, 33);
      doc.text('INVOICE', 105, 20, { align: 'center' });
      
      // Add invoice details
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Mockey', 20, 30);
      doc.text('www.mockey.app', 20, 35);
      
      // Add invoice number and date
      doc.setFontSize(10);
      doc.setTextColor(33, 33, 33);
      doc.text(`Invoice Number: INV-${Date.now().toString().slice(-8)}`, 140, 30, { align: 'right' });
      doc.text(`Date: ${date}`, 140, 35, { align: 'right' });
      doc.text(`Payment ID: ${paymentId}`, 140, 40, { align: 'right' });
      
      // Add line
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 45, 190, 45);
      
      // Add customer details
      doc.setFontSize(12);
      doc.setTextColor(33, 33, 33);
      doc.text('Billed To:', 20, 55);
      doc.setFontSize(10);
      doc.text(customerName, 20, 62);
      doc.text(customerEmail, 20, 68);
      
      // Add line
      doc.line(20, 75, 190, 75);
      
      // Add table header
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 80, 170, 8, 'F');
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(10);
      doc.text('Description', 25, 85);
      doc.text('Type', 100, 85);
      doc.text('Amount', 170, 85, { align: 'right' });
      
      // Add item row
      doc.text(`${planName} Plan`, 25, 95);
      doc.text(isLifetime ? 'Lifetime' : 'Subscription', 100, 95);
      doc.text(`₹${(amount / 100).toFixed(2)}`, 170, 95, { align: 'right' });
      
      // Add line
      doc.line(20, 105, 190, 105);
      
      // Add total
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', 140, 115);
      doc.text(`₹${(amount / 100).toFixed(2)}`, 170, 115, { align: 'right' });
      
      // Add footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for your purchase!', 105, 140, { align: 'center' });
      doc.text('For support, contact support@mockey.app', 105, 145, { align: 'center' });
      
      // Save the PDF
      doc.save(`invoice-${paymentId}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  };

  // Auto-download on component mount if autoDownload is true
  useEffect(() => {
    if (autoDownload) {
      generatePDF();
    }
  }, [autoDownload]);

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Download Invoice
    </button>
  );
};

export default InvoiceGenerator;
