using AutoMapper;
using HealthJournal_API.Models.Domain;
using HealthJournal_API.Models.DTO;
using HealthJournal_API.Models.DTO.DailyNote;
using HealthJournal_API.Models.DTO.DailyNoteAttribute;
using HealthJournal_API.Models.DTO.HealthReportConfigs;
using HealthJournal_API.Models.DTO.Medication;
using HealthJournal_API.Models.DTO.MedicationPlanEntry;
using HealthJournal_API.Models.DTO.NoteAttribute;
using HealthJournal_API.Models.DTO.Notebook;
using HealthJournal_API.Models.DTO.NoteConfiguration;
using HealthJournal_API.Models.DTO.NoteConfigurationAttribute;
using HealthJournal_API.Models.DTO.Page;
using HealthJournal_API.Models.DTO.PersonalAccessToken;

namespace HealthJournal_API.Mappings
{
    public class AutomapperMappings : Profile
    {
        public AutomapperMappings() 
        {
            CreateMap<DailyNote, DailyNoteDTO>().ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Attributes)).ReverseMap();
            CreateMap<AddDailyNoteDTO, DailyNote>().ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Attributes)).ReverseMap();
            CreateMap<UpdateDailyNoteDTO, DailyNote>().ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Attributes)).ReverseMap();

            CreateMap<DailyNoteAttribute, DailyNoteAttributeDTO>().ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.NoteAttribute.Name)).ReverseMap();

            CreateMap<NoteAttribute, NoteAttributeDTO>().ReverseMap();
            CreateMap<AddNoteAttributeDTO, NoteAttribute>().ReverseMap();
            CreateMap<UpdateNoteAttributeDTO, NoteAttribute>().ReverseMap();


            CreateMap<NoteConfiguration, NoteConfigurationDTO>().ForMember(dest => dest.NoteAttributes, opt => opt.MapFrom(src => src.NoteAttributes)).ReverseMap();
            CreateMap<AddNoteConfigurationDTO, NoteConfiguration>().ForMember(dest => dest.NoteAttributes, opt => opt.MapFrom(src => src.NoteAttributes)).ReverseMap();
            CreateMap<UpdateNoteConfigurationDTO, NoteConfiguration>().ForMember(dest => dest.NoteAttributes, opt => opt.MapFrom(src => src.NoteAttributes)).ReverseMap();

            CreateMap<NoteConfigurationAttribute, NoteConfigurationAttributeDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.NoteAttribute.Name))
                .ForMember(dest => dest.Element, opt => opt.MapFrom(src => src.NoteAttribute.Element))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.NoteAttribute.Id))
                .ReverseMap();

            CreateMap<Notebook, NotebookDTO>().ForMember(dest => dest.isShared, opt => opt.MapFrom(src => src.UserId == null)).ReverseMap();
            CreateMap<AddNotebookDTO, Notebook>().ReverseMap();
            CreateMap<UpdateNotebookDTO, Notebook>().ReverseMap();

            CreateMap<Page, PageDTO>().ReverseMap();
            CreateMap<AddPageDTO, Page>().ReverseMap();
            CreateMap<UpdatePageDTO, Page>().ReverseMap();

            CreateMap<PersonalAccessToken, PersonalAccessTokenDTO>().ReverseMap();

            CreateMap<Medication, MedicationDTO>().ReverseMap();
            CreateMap<AddMedicationDTO, Medication>().ReverseMap();
            CreateMap<UpdateMedicationDTO, Medication>().ReverseMap();

            CreateMap<MedicationPlanEntry, MedicationPlanEntryDTO>().ReverseMap();
            CreateMap<AddMedicationPlanEntryDTO, MedicationPlanEntry>().ReverseMap();
            CreateMap<UpdateMedicationPlanEntryDTO, MedicationPlanEntry>().ReverseMap();

            CreateMap<HealthReportConfig, HealthReportConfigDTO>().ReverseMap();
            CreateMap<AddHealthReportConfigDTO, HealthReportConfig>().ReverseMap();
            CreateMap<AttributeVisualization, AttributeVisualizationDTO>().ReverseMap();
            CreateMap<ColorCodeConfiguration, ColorCodeConfigurationDTO>().ReverseMap();
            CreateMap<DiaryFilterConfiguration, DiaryFilterConfigurationDTO>().ReverseMap();
            CreateMap<FilterClause, FilterClauseDTO>().ReverseMap();
        }
    }
}
