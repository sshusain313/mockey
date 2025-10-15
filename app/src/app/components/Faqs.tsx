'use client';

export default function FAQSection() {
  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-12">FAQs</h2>

      {faqData.map((faq, idx) => (
        <div key={idx} className="mb-12">
          <div className="flex items-start gap-8">
            <div className="text-4xl font-extrabold text-black">{String(idx + 1).padStart(2, '0')}</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
            </div>
          </div>
          <hr className="my-6 border-t border-gray-200" />
        </div>
      ))}
    </section>
  );
}

const faqData = [
  {
    question: 'What is a Mockup?',
    answer: 'Mockups help you visualise your designs and logos in a real-life setting. Creating mockups is the process of applying your designs or logos virtually on apparels, phones, posters, business cards, or any accessories to showcase how it’ll look like in real life.'
  },
  {
    question: 'What is Mockey?',
    answer: 'Mockey is an online AI Mockup Generator which allows you to create free mockups online. One can create product mockups, mockups for t-shirt, hoodies, apparels, accessories and more easily using Mockey. It also offers <span class="text-pink-500">AI mockup bundles</span>, 3D Mockups, <span class="text-pink-500">AI image background remover</span>, AI Photography, <span class="text-pink-500">Blur background</span> and other <span class="text-pink-500">Image Editing Tools</span>.\nMockey is also available on PlayStore for Android Users, <span class="text-pink-500">Install Mockey mobile app</span>.'
  },
  {
    question: 'How do I make a free mockup?',
    answer: 'To create a free mockup, upload your design on Mockey as an image (PNG or JPEG). Use transparent designs or logos in high-resolution for best result. Your design will show up on all the products on Mockey, you can choose products mockups that you want to download, adjust the design, customise color & background image, and download the free mockup.'
  },
  {
    question: 'What is the best free mockup generator with no watermark?',
    answer: 'Mockey is the best mockup generator with no watermark. There are many other free online mockup generators in the market. But the end result on most of these platforms like MockupBro, MockuPhone, MockItUp, etc. come with watermark. On the other hand, Mockey allows you to download high-quality image without a watermark.'
  },
  {
    question: 'What free Mockups can I create using Mockey?',
    answer: 'Using Mockey, you can create 1000+ unique T-shirt mockups, hoodie mockup, oversized t-shirt mockup, sweatshirt mockup, sticker mockup, tote bag mockup, croptop mockup, and crop hoodie mockup. We’ll be introducing more product mockup photos free and new categories every month.'
  },
  {
    question: 'Is Mockey Mockup Generator available on PlayStore?',
    answer: 'Yes, Mockey is available on PlayStore. You can <span class="text-pink-500">Install Mockey Mobile App</span> from here.'
  },
  {
    question: 'How do you make a mockup without Photoshop?',
    answer: 'You can use an online mockup generator to make a mockup without photoshop. It is not necessary to learn photoshop for making mockups. You can use free tools like Mockey to design free mockups online and download unlimited mockups.'
  },
  {
    question: 'What are some Placeit Alternatives?',
    answer: `15 Best Placeit Alternatives (Free Included) 2024:\n\n1. Mockey.ai (Free unlimited mockup download and no watermark)\n2. Renderforest\n3. SmartMockups\n4. Canva\n5. Invideo\n6. Mockup-Photos\n7. DesignCap\n8. PicMonkey\n9. VistaCreate\n10. Snappa\n11. WDFlat\n12. Adobe Spark\n13. Stencil\n14. FotoJet\n15. VideoBolt\n16. DesignEvo`
  },
  {
    question: 'Where can I make a free mockup?',
    answer: 'You can create high-quality professional mockups for free on <span class="text-pink-500">Mockey.ai</span>. Read How to Create Product Mockups For Free.'
  },
  {
    question: 'Is Smartmockups Free?',
    answer: 'Smartmockups give one month free trial and allows you to download low quality photos in the 1 month free trial. Smartmockups pro plan costs $14/month after that. So the correct answer is that Smartmockups is not free.'
  },
  {
    question: 'Is Placeit mockup free?',
    answer: 'No, Placeit is not free. Placeit costs  $47.69/Annual or $6.33/month. Design Templates, Logos, and Customizable Videos – Placeit are not actually available for free on Placeit.'
  },
  {
    question: 'Is Mockey Free?',
    answer: 'Yes, Mockey AI is free. You can design 5000+ mockups, generate unlimited photos, and download them in high-quality for free. You can download mockups with no watermark.'
  }
];
