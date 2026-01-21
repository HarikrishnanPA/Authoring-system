import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { ArrowLeft } from 'lucide-react';
import { ApiService, ServicesDetailItem, getImageUrl } from '@/lib/api';
import { DetailPageLayout } from '@/components/layout';

// Configure marked for proper rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServicesDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      if (id) {
        const data = await ApiService.getServiceDetailById(parseInt(id));
        setService(data);
      }
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely parse markdown
  const parseMarkdown = (text: string | undefined | null): string => {
    if (!text) return '';
    return marked.parse(text) as string;
  };

  const parseInlineMarkdown = (text: string | undefined | null): string => {
    if (!text) return '';
    return marked.parseInline(text) as string;
  };

  if (!service && !isLoading) {
      return (
          <DetailPageLayout
            isLoading={false}
            error={true}
            notFoundMessage="Service not found"
            onBack={() => navigate('/services')}
            backLabel="Back to Services"
            showEdit={false}
          >
              <></>
          </DetailPageLayout>
      )
  }

  const attributes = service?.attributes;

  return (
    <DetailPageLayout
        isLoading={isLoading}
        onBack={() => navigate('/services')}
        backLabel="Back to Services"
        onEdit={() => navigate(`/services/${id}/edit`)}
    >
      {attributes && (
          <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
            
            {/* Header Section with Hero Image */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{attributes.Title}</h1>
                <div 
                  className="prose prose-lg text-gray-600 max-w-none [&_p]:m-0 [&_strong]:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(attributes.Description) }}
                />
                {attributes.CTAText && (
                  <a 
                    href={attributes.CTALink || '#'}
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    {attributes.CTAText}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </a>
                )}
              </div>
              {attributes.Image?.data && (
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={getImageUrl(attributes.Image.data.attributes.url)} 
                    alt={attributes.Title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Breadcrumbs */}
            {attributes.BreadCrumb && attributes.BreadCrumb.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  {attributes.BreadCrumb.map((crumb, index) => (
                    <span key={index} className="flex items-center text-gray-600">
                      {index > 0 && <span className="mx-2 text-gray-300">/</span>}
                      <a href={crumb.Link} className="hover:text-primary transition-colors">
                        {crumb.Label}
                      </a>
                      {crumb.isMegamenu && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Menu</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hero Cards */}
            {attributes.HeroCard && attributes.HeroCard.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attributes.HeroCard.map((card, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{card.Title}</h3>
                    <div 
                       className="text-gray-600 prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-gray-900"
                       dangerouslySetInnerHTML={{ __html: parseMarkdown(card.Description) }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section One */}
            {(attributes.SectionOneTag || attributes.SectionOneTitle) && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-8 border-b border-gray-100">
                  {attributes.SectionOneTag && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {attributes.SectionOneTag}
                      </span>
                    </div>
                  )}
                  <h2 
                    className="text-2xl font-bold text-gray-900 mb-4"
                    dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(attributes.SectionOneTitle) }}
                  />
                  {attributes.SectionOneStrongText && (
                    <p className="text-lg font-semibold text-gray-700 mb-4">{attributes.SectionOneStrongText}</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-8 text-gray-600">
                    <div 
                       className="prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-gray-900"
                       dangerouslySetInnerHTML={{ __html: parseMarkdown(attributes.SectionOnePrimaryDescription) }}
                    />
                    <div 
                       className="prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-gray-900"
                       dangerouslySetInnerHTML={{ __html: parseMarkdown(attributes.SectionOneSecondaryDescription) }}
                    />
                  </div>
                </div>
                
                {attributes.SectionOneCard && attributes.SectionOneCard.length > 0 && (
                  <div className="bg-gray-50 p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {attributes.SectionOneCard.map((card, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex gap-4">
                          {card.Icon?.data && (
                            <div className="flex-shrink-0">
                              <img 
                                src={getImageUrl(card.Icon.data.attributes.url)} 
                                alt={card.Title}
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                              <h4 
                                 className="text-lg font-bold text-gray-900"
                                 dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(card.Title) }}
                              />
                              {card.Tag && (
                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                                  {card.Tag}
                                </span>
                              )}
                            </div>
                            <div 
                               className="text-gray-600 text-sm prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-gray-900"
                               dangerouslySetInnerHTML={{ __html: parseMarkdown(card.Description) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section Two */}
            {(attributes.SectionTwoTag || attributes.SectionTwoTitle) && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-sm text-white overflow-hidden">
                 <div className="p-8">
                  {attributes.SectionTwoTag && (
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
                        {attributes.SectionTwoTag}
                      </span>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-4">{attributes.SectionTwoTitle}</h2>
                  <div 
                    className="text-gray-300 prose prose-invert prose-sm max-w-none [&_p]:m-0 [&_strong]:text-white"
                     dangerouslySetInnerHTML={{ __html: parseMarkdown(attributes.SectionTwoDescription) }}
                  />
                 </div>

                 {attributes.SectionTwoCard && attributes.SectionTwoCard.length > 0 && (
                   <div className="border-t border-white/10">
                     <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                       {attributes.SectionTwoCard.map((card, index) => (
                         <div key={index} className="p-8 hover:bg-white/5 transition-colors">
                           <div className="flex items-start gap-4 mb-4">
                             {card.PrimaryIcon?.data && (
                               <img 
                                 src={getImageUrl(card.PrimaryIcon.data.attributes.url)} 
                                 alt={card.PrimaryTitle}
                                 className="w-10 h-10 object-contain"
                               />
                             )}
                             <div>
                               <h3 className="text-lg font-bold text-white">{card.PrimaryTitle}</h3>
                               <div 
                                  className="text-gray-400 text-sm prose prose-invert prose-sm max-w-none [&_p]:m-0"
                                   dangerouslySetInnerHTML={{ __html: parseMarkdown(card.PrimaryDescription) }}
                               />
                             </div>
                           </div>
                           
                           <div className="flex items-start gap-4 mt-6">
                             {card.SecondaryIcon?.data && (
                               <img 
                                 src={getImageUrl(card.SecondaryIcon.data.attributes.url)} 
                                 alt={card.SecondaryTitle}
                                 className="w-8 h-8 object-contain opacity-75"
                               />
                             )}
                             <div>
                               <h4 className="text-base font-semibold text-white">{card.SecondaryTitle}</h4>
                               <div 
                                  className="text-gray-400 text-sm prose prose-invert prose-sm max-w-none [&_p]:m-0"
                                   dangerouslySetInnerHTML={{ __html: parseMarkdown(card.SecondaryDescription) }}
                               />
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            )}

             {/* Section Three */}
             {(attributes.SectionThreeTitle || attributes.SectionThreeCard?.length) && (
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">{attributes.SectionThreeTitle}</h2>
                  {attributes.SectionThreeCard && (
                    <div className="space-y-4">
                      {attributes.SectionThreeCard.map((card, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                          {card.Image?.data && (
                            <img 
                              src={getImageUrl(card.Image.data.attributes.url)} 
                              alt={card.Title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{card.Title}</h3>
                            <p className="text-primary font-medium">{card.SubTitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {attributes.SectionThreeImage?.data && (
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                     <img 
                      src={getImageUrl(attributes.SectionThreeImage.data.attributes.url)} 
                      alt={attributes.SectionThreeTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}

             {/* Section Four - Metrics */}
             {(attributes.SectionFourTitle || attributes.SectionFourCard?.length) && (
               <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">{attributes.SectionFourTitle}</h2>
                  {attributes.SectionFourCard && (
                    <div className="grid md:grid-cols-3 gap-8">
                      {attributes.SectionFourCard.map((stat, index) => (
                        <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                          <div 
                             className="text-4xl font-black text-primary mb-2"
                             dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(stat.Metric) }}
                          />
                          <div 
                            className="text-gray-600 font-medium prose prose-sm max-w-none [&_p]:m-0 text-center mx-auto [&_strong]:text-gray-900"
                             dangerouslySetInnerHTML={{ __html: parseMarkdown(stat.Description) }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            )}

             {/* Section Six */}
             {(attributes.SectionSixTag || attributes.SectionSixTitle) && (
               <div className="space-y-8">
                 <div className="text-center max-w-2xl mx-auto">
                   {attributes.SectionSixTag && (
                     <span className="text-primary font-semibold tracking-wider text-sm uppercase">{attributes.SectionSixTag}</span>
                   )}
                   <h2 className="text-3xl font-bold text-gray-900 mt-2">{attributes.SectionSixTitle}</h2>
                 </div>

                 {attributes.SectionSixCardOne && (
                   <div className="grid md:grid-cols-3 gap-6">
                     {attributes.SectionSixCardOne.map((card, index) => (
                       <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                         {card.Icon?.data ? (
                           <div className="h-12 w-12 mb-4">
                             <img 
                               src={getImageUrl(card.Icon.data.attributes.url)} 
                               alt={card.Title}
                               className="w-full h-full object-contain"
                             />
                           </div>
                         ) : card.Tag && (
                           <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold mb-4">
                             {card.Tag}
                           </div>
                         )}
                          <h3 
                            className="text-xl font-bold text-gray-900 mb-3"
                            dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(card.Title) }}
                          />
                         <div 
                            className="text-gray-600 prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-gray-900"
                             dangerouslySetInnerHTML={{ __html: parseMarkdown(card.Description) }}
                         />
                       </div>
                     ))}
                   </div>
                 )}

                 {attributes.SectionSixCardTwo && attributes.SectionSixCardTwo.length > 0 && (
                   <div className="space-y-4">
                     {attributes.SectionSixCardTwo.map((tag, index) => (
                       <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                         <h4 className="font-semibold text-gray-900 mb-2">{tag.Title}</h4>
                         {tag.Text && tag.Text.length > 0 && (
                           <div className="flex flex-wrap gap-2">
                             {tag.Text.map((item, idx) => (
                               <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                 {item.Text}
                               </span>
                             ))}
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            )}

             {/* Section Seven */}
             {(attributes.SectionSevenTag || attributes.SectionSevenTitle) && (
               <div className="bg-gray-900 rounded-2xl shadow-sm p-8 md:p-12 text-center text-white relative overflow-hidden">
                 <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    {attributes.SectionSevenTag && (
                      <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                       {attributes.SectionSevenTag}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold">{attributes.SectionSevenTitle}</h2>
                    
                    {attributes.SectionSevenCard && (
                      <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
                         {attributes.SectionSevenCard.map((card, index) => (
                           <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                             <div className="text-3xl font-bold text-blue-400 mb-1">{card.Metric}</div>
                             <div className="text-lg font-semibold mb-2">{card.PrimaryTitle}</div>
                             <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">{card.SecondaryTitle}</div>
                             <div 
                                className="text-gray-300 text-sm prose prose-invert prose-sm max-w-none [&_p]:m-0 mb-4"
                                 dangerouslySetInnerHTML={{ __html: parseMarkdown(card.Description) }}
                             />
                             {card.TagList && card.TagList.length > 0 && (
                               <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                                 {card.TagList.map((tag, idx) => (
                                   <span key={idx} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded">
                                     {tag.Text}
                                   </span>
                                 ))}
                               </div>
                             )}
                           </div>
                         ))}
                      </div>
                    )}
                 </div>
               </div>
            )}
             
             {/* List Items Detail */}
             {attributes.ListItems && attributes.ListItems.length > 0 && (
               <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-gray-900">Additional Details</h2>
                 <div className="space-y-6">
                   {attributes.ListItems.map((item, index) => (
                     <div 
                       key={index} 
                       className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 ${
                         item.AlignImageToLeft ? '' : 'md:flex-row-reverse'
                       }`}
                     >
                        {item.Image?.data && (
                          <div className="md:w-1/3 flex-shrink-0">
                            <img 
                              src={getImageUrl(item.Image.data.attributes.url)} 
                              alt={item.Title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             {item.PrimaryTag && (
                               <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">{item.PrimaryTag}</span>
                             )}
                             {item.SecondaryTag && (
                               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">{item.SecondaryTag}</span>
                             )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{item.Title}</h3>
                          <div 
                             className="text-gray-600 prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-gray-900"
                              dangerouslySetInnerHTML={{ __html: parseMarkdown(item.Description) }}
                          />
                          
                          {item.Card && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">{item.Card.Title}</h4>
                              {item.Card.Text && item.Card.Text.length > 0 && (
                                <ul className="space-y-1">
                                  {item.Card.Text.map((text, idx) => (
                                    <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                      <span className="text-primary mt-1">•</span>
                                      {text.Text}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

            {/* CTA Form Section */}
            {attributes.CTAForm && (attributes.CTAForm.Title || attributes.CTAForm.Description) && (
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-white text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{attributes.CTAForm.Title}</h2>
                <div 
                  className="prose prose-invert max-w-2xl mx-auto [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(attributes.CTAForm.Description) }}
                />
                {attributes.CTALink && (
                  <a 
                    href={attributes.CTALink}
                    className="inline-flex items-center gap-2 mt-6 px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
                  >
                    {attributes.CTAText || 'Get Started'}
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </a>
                )}
              </div>
            )}
            
          </div>
      )}
    </DetailPageLayout>
  );
}
