<template>
  <div class="page-body site-management-page">
    <CommonBreadcrumb page="Sitio público" title="Configuración del sitio" />

    <div class="container-fluid">
      <div class="card">
        <div
          class="card-header d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center"
        >
          <div>
            <h5>Template y colores</h5>
            <span class="text-muted">
              La plantilla y el tema se aplican de forma global al sitio
              público.
            </span>
          </div>

          <button
            class="btn btn-pill btn-dashed color-4"
            type="button"
            :disabled="isLoading"
            @click="loadAll"
          >
            Recargar
          </button>
        </div>

        <div class="card-body admin-form">
          <div v-if="isLoading" class="alert alert-info mb-0">
            Cargando configuración del sitio...
          </div>

          <div v-else class="row gx-3">
            <div class="col-lg-4">
              <CommonInputfieldsSelectfield
                v-model="templateForm.template_set"
                :data="templateSelectOptions"
                :disabled="isSavingTemplate"
                :error="getTemplateError('template_set')"
                label="Template global"
                label-field="name"
                name="site-template-set"
                show="Selecciona un template"
              />
              <small class="text-muted d-block mt-1">
                {{ selectedTemplateDescription }}
              </small>
            </div>

            <div
              v-for="field in themeFields"
              :key="field.key"
              class="form-group col-md-4 col-lg-2"
              :class="{ 'was-validated': getThemeError(field.key) }"
            >
              <label :for="`site-theme-${field.key}`">{{ field.label }}</label>
              <div class="site-color-field">
                <input
                  :id="`site-theme-${field.key}`"
                  v-model="templateForm.theme[field.key]"
                  class="form-control form-control-color site-color-input"
                  :class="{ 'is-invalid': getThemeError(field.key) }"
                  type="color"
                  :disabled="isSavingTemplate"
                />
                <span class="site-color-value">
                  {{ templateForm.theme[field.key] }}
                </span>
              </div>
              <small v-if="getThemeError(field.key)" class="text-danger">
                {{ getThemeError(field.key) }}
              </small>
            </div>

            <div class="col-12">
              <div
                class="site-theme-preview card border"
                :style="themePreviewStyle"
              >
                <span class="preview-dot preview-dot-primary"></span>
                <span class="preview-dot preview-dot-secondary"></span>
                <div>
                  <strong>Vista rápida del tema</strong>
                  <small>
                    Primary y secondary se editan desde aquí. Accent se guarda
                    automáticamente igual al primary.
                  </small>
                </div>
              </div>
            </div>

            <div class="form-btn col-12 mt-2">
              <button
                v-if="canEditSiteSettings"
                class="btn btn-pill btn-gradient color-4"
                type="button"
                :disabled="isSavingTemplate || isRestoringTemplate"
                @click="saveTemplate"
              >
                Guardar template y colores
              </button>

              <button
                v-if="canEditSiteSettings"
                class="btn btn-pill btn-dashed color-4"
                type="button"
                :disabled="isSavingTemplate || isRestoringTemplate || !templateSnapshot"
                @click="cancelTemplate"
              >
                Cancelar
              </button>

              <button
                v-if="canEditSiteSettings"
                class="btn btn-pill btn-dashed color-2"
                type="button"
                :disabled="isSavingTemplate || isRestoringTemplate || !hasTemplateBackup"
                @click="doRestoreTemplate"
              >
                <i class="fa fa-undo me-1"></i>
                Restaurar anterior
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5>Contenido por página</h5>
          <span class="text-muted">
            Cada página guarda estado y contenido. La plantilla se hereda del
            template global.
          </span>
        </div>

        <div class="card-body admin-form">
          <div v-if="isLoading" class="alert alert-info mb-0">
            Cargando páginas configurables...
          </div>

          <div v-else class="site-page-layout">
            <nav class="site-page-nav" aria-label="Páginas del sitio">
              <button
                v-for="page in REALSTATE_SITE_PAGE_OPTIONS"
                :key="page.id"
                class="site-page-nav-item card border"
                :class="{ active: activePage === page.id }"
                type="button"
                @click="activePage = page.id"
              >
                <span>{{ page.label }}</span>
                <small>{{ page.description }}</small>
                <span
                  class="badge"
                  :class="
                    pagesForm[page.id].is_active
                      ? 'badge-success'
                      : 'badge-secondary'
                  "
                >
                  {{ pagesForm[page.id].is_active ? "Activa" : "Inactiva" }}
                </span>
              </button>
            </nav>

            <section class="site-page-editor">
              <div
                class="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-start mb-3"
              >
                <div>
                  <h5 class="mb-1">{{ activePageMeta.label }}</h5>
                  <p class="text-muted mb-0">
                    {{ activePageMeta.description }}
                  </p>
                </div>

                <CommonInputfieldsCheckbox
                  v-model="currentPage.is_active"
                  :name="`site-page-${activePage}-active`"
                  classes="site-active-checkbox"
                  label="Página activa"
                />
              </div>

              <div
                class="alert alert-light border d-flex flex-wrap gap-2 site-template-note"
              >
                <span>Template heredado:</span>
                <strong>{{ globalTemplateLabel }}</strong>
                <span class="text-muted">
                  El backend valida que coincida con el template global.
                </span>
              </div>

              <div
                v-if="currentPageErrorMessages.length"
                class="alert alert-danger"
              >
                <div v-for="message in currentPageErrorMessages" :key="message">
                  {{ message }}
                </div>
              </div>

              <form class="row gx-3" @submit.prevent="saveActivePage">
                <template v-if="activePage === 'home'">
                  <RealstateSiteManagementImagePicker
                    v-model="homeContent.background_image_url"
                    classes="col-12"
                    label="Imagen de fondo del inicio"
                    hint="Se usa como imagen principal de fondo en la página de inicio."
                  />

                  <RealstateSiteManagementImagePicker
                    v-model="homeContent.featured_sections_bg_url"
                    classes="col-12"
                    label="Imagen de fondo — Propiedades destacadas"
                    hint="Fondo de la sección de propiedades destacadas en la página de inicio."
                  />

                  <div class="col-12">
                    <div class="repeatable-section card border">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <div>
                          <h6>Slides del inicio</h6>
                          <small class="text-muted">
                            Estos textos alimentan el hero principal del sitio
                            público.
                          </small>
                        </div>
                        <button
                          class="btn btn-pill btn-gradient color-4"
                          type="button"
                          @click="addHomeSlide"
                        >
                          Agregar slide
                        </button>
                      </div>

                      <div
                        v-if="!homeContent.hero_slides.length"
                        class="text-muted"
                      >
                        No hay slides configurados.
                      </div>

                      <div
                        v-for="(item, index) in homeContent.hero_slides"
                        :key="`home-slide-${index}`"
                        class="repeatable-item card border"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Slide {{ index + 1 }}</strong>
                          <button
                            class="btn btn-dashed color-4"
                            type="button"
                            @click="removeHomeSlide(index)"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="item.title"
                            classes="col-md-6"
                            label="Título"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.description"
                            classes="col-md-6"
                            label="Descripción"
                            :required="false"
                          />

                          <RealstateSiteManagementImagePicker
                            v-model="item.img"
                            classes="col-12"
                            label="Imagen"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.link"
                            classes="col-md-6"
                            label="Enlace"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.button_text"
                            classes="col-md-6"
                            label="Texto del botón"
                            :required="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="repeatable-section card border">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <div>
                          <h6>Secciones destacadas</h6>
                          <small class="text-muted">
                            Grupos con enlaces e iconos SVG bajo el hero.
                          </small>
                        </div>
                        <button
                          class="btn btn-pill btn-gradient color-4"
                          type="button"
                          @click="addFeaturedSection"
                        >
                          Agregar grupo
                        </button>
                      </div>

                      <div
                        v-if="!homeContent.featured_sections.length"
                        class="text-muted"
                      >
                        No hay secciones destacadas configuradas.
                      </div>

                      <div
                        v-for="(
                          section, index
                        ) in homeContent.featured_sections"
                        :key="`featured-${index}`"
                        class="repeatable-item card border"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Grupo {{ index + 1 }}</strong>
                          <button
                            class="btn btn-dashed color-4"
                            type="button"
                            @click="removeFeaturedSection(index)"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="section.heading"
                            classes="col-md-8"
                            label="Título del grupo"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="section.type"
                            classes="col-md-4"
                            label="Tipo"
                            :required="false"
                          />
                        </div>

                        <div
                          class="d-flex justify-content-between align-items-center mt-3 mb-2"
                        >
                          <small class="text-muted"> Items del grupo </small>
                          <button
                            class="btn btn-pill btn-gradient color-4"
                            type="button"
                            @click="addFeaturedIcon(index)"
                          >
                            Agregar item
                          </button>
                        </div>

                        <div
                          v-if="!section.icons.length"
                          class="text-muted small"
                        >
                          No hay items configurados en este grupo.
                        </div>

                        <div
                          v-for="(item, itemIndex) in section.icons"
                          :key="`featured-${index}-${itemIndex}`"
                          class="featured-icon-item card border"
                        >
                          <div
                            class="d-flex justify-content-between align-items-center mb-2"
                          >
                            <small class="text-muted">
                              Item {{ itemIndex + 1 }}
                            </small>
                            <button
                              class="btn btn-dashed color-4"
                              type="button"
                              @click="removeFeaturedIcon(index, itemIndex)"
                            >
                              <i class="fa fa-trash"></i>
                            </button>
                          </div>

                          <div class="row gx-3">
                            <CommonInputfieldsTextfield
                              v-model="item.name"
                              classes="col-md-4"
                              label="Título"
                              :required="false"
                            />

                            <CommonInputfieldsTextfield
                              v-model="item.icon"
                              classes="col-md-4"
                              label="Ícono SVG"
                              :required="false"
                            />

                            <CommonInputfieldsTextfield
                              v-model="item.path"
                              classes="col-md-4"
                              label="Enlace"
                              :required="false"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="activePage === 'propertyList'">
                  <RealstateSiteManagementImagePicker
                    v-model="propertyListContent.banner_image_url"
                    classes="col-12"
                    label="Imagen del banner"
                  />

                  <CommonInputfieldsTextfield
                    v-model="propertyListContent.title"
                    :error="getPageError('title')"
                    classes="col-md-6"
                    label="Título"
                    :required="false"
                  />

                  <CommonInputfieldsTextfield
                    v-model="propertyListContent.subtitle"
                    :error="getPageError('subtitle')"
                    classes="col-md-6"
                    label="Subtítulo"
                    :required="false"
                  />
                </template>

                <template v-else-if="activePage === 'propertyDetail'">
                  <CommonInputfieldsCheckbox
                    v-model="propertyDetailContent.show_related_properties"
                    classes="col-md-6"
                    label="Mostrar propiedades relacionadas"
                    name="show_related_properties"
                  />

                  <CommonInputfieldsTextfield
                    v-model="propertyDetailContent.contact_title"
                    :error="getPageError('contact_title')"
                    classes="col-md-6"
                    label="Título de contacto"
                    :required="false"
                  />

                  <CommonInputfieldsTextarea
                    v-model="propertyDetailContent.contact_description"
                    :error="getPageError('contact_description')"
                    classes="col-md-6"
                    label="Descripción de contacto"
                    :required="false"
                  />

                  <CommonInputfieldsTextfield
                    v-model="propertyDetailContent.related_title"
                    :error="getPageError('related_title')"
                    classes="col-md-6"
                    label="Título de relacionados"
                    :required="false"
                  />

                  <div class="col-12">
                    <div class="repeatable-section card border">
                      <RealstateSiteManagementImagePicker
                        v-model="propertyDetailContent.gallery_fallback"
                        classes="col-12"
                        hint="Se usan solo si la propiedad no tiene imágenes propias."
                        item-classes="col-12 col-sm-6 col-lg-3"
                        label="Imágenes fallback de la galería"
                        :max-images="10"
                      />
                    </div>
                  </div>
                </template>

                <template v-else-if="activePage === 'about'">
                  <RealstateSiteManagementImagePicker
                    v-model="aboutContent.banner_image_url"
                    classes="col-12"
                    label="Imagen del banner"
                  />

                  <div class="col-12">
                    <div class="repeatable-section card border">
                      <h6 class="mb-3">Introducción</h6>

                      <div class="row gx-3">
                        <CommonInputfieldsTextfield
                          v-model="aboutContent.intro.title"
                          :error="getPageError('intro.title')"
                          classes="col-md-6"
                          label="Título introductorio"
                          :required="false"
                        />

                        <CommonInputfieldsTextarea
                          v-model="aboutContent.intro.description"
                          :error="getPageError('intro.description')"
                          classes="col-md-6"
                          label="Descripción introductoria"
                          :required="false"
                        />

                        <RealstateSiteManagementImagePicker
                          v-model="aboutIntroImageUrls"
                          classes="col-12"
                          hint="Estas son las dos imágenes sobrepuestas de la sección Nosotros."
                          item-classes="col-12 col-md-6"
                          label="Imágenes sobrepuestas"
                          :max-images="2"
                        />
                      </div>
                    </div>
                  </div>

                  <CommonInputfieldsTextarea
                    v-model="aboutContent.history"
                    :error="getPageError('history')"
                    classes="col-md-4"
                    label="Historia"
                    :required="false"
                  />

                  <CommonInputfieldsTextarea
                    v-model="aboutContent.mission"
                    :error="getPageError('mission')"
                    classes="col-md-4"
                    label="Misión"
                    :required="false"
                  />

                  <CommonInputfieldsTextarea
                    v-model="aboutContent.vision"
                    :error="getPageError('vision')"
                    classes="col-md-4"
                    label="Visión"
                    :required="false"
                  />

                  <div class="col-12">
                    <div class="repeatable-section card border">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <h6>Por qué elegirnos</h6>
                        <button
                          class="btn btn-pill btn-gradient color-4"
                          type="button"
                          @click="addWhyChooseUs"
                        >
                          Agregar razón
                        </button>
                      </div>

                      <div
                        v-if="!aboutContent.why_choose_us.length"
                        class="text-muted"
                      >
                        No hay razones configuradas.
                      </div>

                      <div
                        v-for="(item, index) in aboutContent.why_choose_us"
                        :key="`why-${index}`"
                        class="repeatable-item card border"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Razón {{ index + 1 }}</strong>
                          <button
                            class="btn btn-dashed color-4"
                            type="button"
                            @click="removeWhyChooseUs(index)"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="item.icon"
                            classes="col-md-4"
                            label="Ícono"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.title"
                            classes="col-md-8"
                            label="Título"
                            :required="false"
                          />

                          <CommonInputfieldsTextarea
                            v-model="item.description"
                            classes="col-12"
                            label="Descripción"
                            :required="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="activePage === 'services'">
                  <RealstateSiteManagementImagePicker
                    v-model="servicesContent.banner_image_url"
                    classes="col-12"
                    label="Imagen del banner"
                  />

                  <CommonInputfieldsTextfield
                    v-model="servicesContent.hero.title"
                    classes="col-md-6"
                    label="Título del hero"
                    :required="false"
                  />

                  <CommonInputfieldsTextarea
                    v-model="servicesContent.hero.description"
                    classes="col-md-6"
                    label="Descripción del hero"
                    :required="false"
                  />

                  <RealstateSiteManagementImagePicker
                    v-model="servicesContent.hero.image"
                    classes="col-12"
                    label="Imagen del hero"
                  />

                  <CommonInputfieldsTextfield
                    v-model="servicesContent.hero.button_text"
                    classes="col-md-6"
                    label="Texto del botón"
                    :required="false"
                  />

                  <CommonInputfieldsTextfield
                    v-model="servicesContent.hero.button_link"
                    classes="col-md-6"
                    label="Enlace del botón"
                    :required="false"
                  />

                  <div class="col-12">
                    <div class="repeatable-section card border">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <h6>Servicios prestados</h6>
                        <button
                          class="btn btn-pill btn-gradient color-4"
                          type="button"
                          @click="addProvidedService"
                        >
                          Agregar servicio
                        </button>
                      </div>

                      <div
                        v-if="!servicesContent.provided_services.length"
                        class="text-muted"
                      >
                        No hay servicios prestados configurados.
                      </div>

                      <div
                        v-for="(
                          item, index
                        ) in servicesContent.provided_services"
                        :key="`provided-${index}`"
                        class="repeatable-item card border"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Servicio {{ index + 1 }}</strong>
                          <button
                            class="btn btn-dashed color-4"
                            type="button"
                            @click="removeProvidedService(index)"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="item.title"
                            classes="col-md-4"
                            label="Título"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.icon"
                            classes="col-md-4"
                            label="Ícono"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.link"
                            classes="col-md-4"
                            label="Enlace"
                            :required="false"
                          />

                          <CommonInputfieldsTextarea
                            v-model="item.description"
                            classes="col-12"
                            label="Descripción"
                            :required="false"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="repeatable-section card border">
                      <div
                        class="d-flex justify-content-between align-items-center mb-3"
                      >
                        <h6>Servicios de propiedades</h6>
                        <button
                          class="btn btn-pill btn-gradient color-4"
                          type="button"
                          @click="addPropertyService"
                        >
                          Agregar servicio
                        </button>
                      </div>

                      <div
                        v-if="!servicesContent.property_services.length"
                        class="text-muted"
                      >
                        No hay servicios de propiedades configurados.
                      </div>

                      <div
                        v-for="(
                          item, index
                        ) in servicesContent.property_services"
                        :key="`property-service-${index}`"
                        class="repeatable-item card border"
                      >
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <strong>Servicio {{ index + 1 }}</strong>
                          <button
                            class="btn btn-dashed color-4"
                            type="button"
                            @click="removePropertyService(index)"
                          >
                            <i class="fa fa-trash"></i>
                          </button>
                        </div>

                        <div class="row gx-3">
                          <CommonInputfieldsTextfield
                            v-model="item.title"
                            classes="col-md-4"
                            label="Título"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.icon"
                            classes="col-md-4"
                            label="Ícono"
                            :required="false"
                          />

                          <CommonInputfieldsTextfield
                            v-model="item.link"
                            classes="col-md-4"
                            label="Enlace"
                            :required="false"
                          />

                          <CommonInputfieldsTextarea
                            v-model="item.description"
                            classes="col-md-6"
                            label="Descripción"
                            :required="false"
                          />

                          <div class="form-group col-md-6">
                            <label>Puntos destacados</label>
                            <textarea
                              class="form-control"
                              rows="4"
                              :value="pointsToText(item.points)"
                              @input="setItemPoints(item, $event)"
                            ></textarea>
                            <small class="text-muted">
                              Escribe un punto por línea.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="activePage === 'contact'">
                  <RealstateSiteManagementImagePicker
                    v-model="contactContent.banner_image_url"
                    classes="col-12"
                    label="Imagen del banner"
                  />

                  <CommonInputfieldsTextfield
                    v-model="contactContent.title"
                    classes="col-md-6"
                    label="Título"
                    :required="false"
                  />

                  <CommonInputfieldsTextarea
                    v-model="contactContent.description"
                    classes="col-md-6"
                    label="Descripción"
                    :required="false"
                  />

                  <RealstateSiteManagementImagePicker
                    v-model="contactContent.image"
                    classes="col-12"
                    label="Imagen principal"
                  />
                </template>

                <template v-else-if="activePage === 'layout'">
                  <RealstateSiteManagementImagePicker
                    v-model="layoutContent.footer_bg_url"
                    classes="col-12"
                    label="Imagen de fondo del footer"
                    hint="Se aplica como fondo de la sección footer en todas las páginas del sitio público."
                  />
                </template>

                <div class="form-btn col-12 mt-3">
                  <button
                    v-if="canEditSiteSettings"
                    class="btn btn-pill btn-gradient color-4"
                    type="submit"
                    :disabled="isSavingPage || isRestoringPage"
                  >
                    Guardar página
                  </button>

                  <button
                    v-if="canEditSiteSettings"
                    class="btn btn-pill btn-dashed color-4"
                    type="button"
                    :disabled="isSavingPage || isRestoringPage || !pagesSnapshot"
                    @click="cancelPage"
                  >
                    Cancelar
                  </button>

                  <button
                    v-if="canEditSiteSettings"
                    class="btn btn-pill btn-dashed color-2"
                    type="button"
                    :disabled="isSavingPage || isRestoringPage || !hasActivePageBackup"
                    @click="doRestorePage"
                  >
                    <i class="fa fa-undo me-1"></i>
                    Restaurar anterior
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApiHandler } from "~/composables/useApiHandler";
import {
  REALSTATE_SITE_PAGE_OPTIONS,
  REALSTATE_TEMPLATE_OPTIONS,
  isHexThemeColor,
  normalizeRealstateTheme,
} from "~/constants/RealstateTemplates";
import AlertService from "~/services/AlertService";
import RealstateSiteManagementService from "~/services/RealstateSiteManagementService";
import { usecustomizerStore } from "~/store/costomizer";

import type {
  RealstateSitePageKey,
  RealstateTemplateSet,
  RealstateTheme,
} from "~/constants/RealstateTemplates";
import type { ILookup } from "~/interfaces/ILookup";
import type {
  RealstateAboutContent,
  RealstateAboutIntroContent,
  RealstateContactContent,
  RealstateContentItem,
  RealstateEditableImage,
  RealstateFeaturedIcon,
  RealstateFeaturedSection,
  RealstateHeroContent,
  RealstateHomeContent,
  RealstateHomeSlide,
  RealstateLayoutContent,
  RealstatePropertyDetailContent,
  RealstatePropertyListContent,
  RealstateServicesContent,
  RealstateSitePage,
  RealstateSitePageContent,
  RealstateSitePagePayload,
  RealstateSitePages,
  RealstateSiteTemplateData,
  RealstateSiteTemplatePayload,
} from "~/interfaces/IRealstateSiteManagement";

type ThemeFieldKey = Exclude<keyof RealstateTheme, "accent">;

const DEFAULT_TEMPLATE_SET: RealstateTemplateSet = "template1";
const EMPTY_ITEM: RealstateContentItem = {
  icon: "fas fa-home",
  title: "",
  description: "",
  link: "",
  points: [],
};
const EMPTY_FEATURED_ICON: RealstateFeaturedIcon = {
  name: "",
  icon: "/svg/icons.svg#home-lock",
  path: "/realstate/property",
};
const EMPTY_FEATURED_SECTION: RealstateFeaturedSection = {
  heading: "Servicios destacados",
  type: "filter",
  icons: [],
};
const EMPTY_HERO: RealstateHeroContent = {
  label: "",
  title: "",
  subtitle: "",
  button_text: "",
  button_link: "",
};
const EMPTY_HOME_SLIDE: RealstateHomeSlide = {
  title: "",
  description: "",
  img: "",
  link: "",
  button_text: "",
};

const themeFields: { key: ThemeFieldKey; label: string }[] = [
  { key: "primary", label: "Primario" },
  { key: "secondary", label: "Secundario" },
];

const { run } = useApiHandler();
const { can } = useAuthorization();
const customizerStore = usecustomizerStore();
const canEditSiteSettings = computed(() => can("site-settings.edit"));

const isLoading = ref(false);
const isSavingTemplate = ref(false);
const isSavingPage = ref(false);
const isRestoringTemplate = ref(false);
const isRestoringPage = ref(false);
const activePage = ref<RealstateSitePageKey>("home");

const templateSnapshot = ref<RealstateSiteTemplatePayload | null>(null);
const pagesSnapshot = ref<RealstateSitePages | null>(null);
const hasTemplateBackup = ref(false);
const pagesWithBackup = ref<string[]>([]);

const hasActivePageBackup = computed(() =>
  pagesWithBackup.value.includes(activePage.value),
);

const templateForm = ref<RealstateSiteTemplatePayload>({
  template_set: DEFAULT_TEMPLATE_SET,
  theme: normalizeRealstateTheme(),
});
const pagesForm = ref<RealstateSitePages>(createPagesState());
const templateErrors = ref<Record<string, string>>({});
const pageErrors =
  ref<Record<RealstateSitePageKey, Record<string, string>>>(createPageErrors());

const templateSelectOptions = computed<ILookup[]>(() =>
  REALSTATE_TEMPLATE_OPTIONS.map((template) => ({
    id: template.id,
    category: "realstate_template",
    name: template.label,
    alias: null,
    value: template.description,
    code: template.id,
    icon: null,
    is_active: true,
    lang: "es",
  })),
);

const selectedTemplateDescription = computed(
  () =>
    REALSTATE_TEMPLATE_OPTIONS.find(
      (template) => template.id === templateForm.value.template_set,
    )?.description ?? "",
);

const globalTemplateLabel = computed(
  () =>
    REALSTATE_TEMPLATE_OPTIONS.find(
      (template) => template.id === templateForm.value.template_set,
    )?.label ?? templateForm.value.template_set,
);

const themePreviewStyle = computed(() => ({
  "--preview-primary": templateForm.value.theme.primary,
  "--preview-secondary": templateForm.value.theme.secondary,
}));

const activePageMeta = computed(
  () =>
    REALSTATE_SITE_PAGE_OPTIONS.find((page) => page.id === activePage.value) ??
    REALSTATE_SITE_PAGE_OPTIONS[0],
);

const currentPage = computed(() => pagesForm.value[activePage.value]);
const currentPageErrors = computed(
  () => pageErrors.value[activePage.value] ?? {},
);
const currentPageErrorMessages = computed(() =>
  Object.entries(currentPageErrors.value).map(
    ([field, message]) => `${field}: ${message}`,
  ),
);

const homeContent = computed(
  () => pagesForm.value.home.content as RealstateHomeContent,
);
const aboutContent = computed(
  () => pagesForm.value.about.content as RealstateAboutContent,
);
const aboutIntroImageUrls = computed<string[]>({
  get: () =>
    aboutContent.value.intro.images
      .map((image) => image.url.trim())
      .filter(Boolean),
  set: (urls) => {
    const currentImages = aboutContent.value.intro.images;

    aboutContent.value.intro.images = urls.map((url, index) => ({
      url,
      alt: currentImages[index]?.alt ?? "",
    }));
  },
});
const servicesContent = computed(
  () => pagesForm.value.services.content as RealstateServicesContent,
);
const propertyListContent = computed(
  () => pagesForm.value.propertyList.content as RealstatePropertyListContent,
);
const propertyDetailContent = computed(
  () =>
    pagesForm.value.propertyDetail.content as RealstatePropertyDetailContent,
);
const contactContent = computed(
  () => pagesForm.value.contact.content as RealstateContactContent,
);
const layoutContent = computed(
  () => pagesForm.value.layout.content as RealstateLayoutContent,
);

function createPageErrors(): Record<
  RealstateSitePageKey,
  Record<string, string>
> {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce(
    (errors, page) => {
      errors[page.id] = {};
      return errors;
    },
    {} as Record<RealstateSitePageKey, Record<string, string>>,
  );
}

function createPagesState(): RealstateSitePages {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce((pages, page) => {
    pages[page.id] = createPageState(page.id);
    return pages;
  }, {} as RealstateSitePages);
}

function createPageState(page: RealstateSitePageKey): RealstateSitePage {
  return {
    is_active: true,
    template: DEFAULT_TEMPLATE_SET,
    content: createDefaultContent(page),
  };
}

function createDefaultContent(
  page: RealstateSitePageKey,
): RealstateSitePageContent {
  if (page === "home") {
    return {
      background_image_url: "",
      featured_sections_bg_url: "",
      hero_slides: [],
      featured_sections: [],
    };
  }

  if (page === "about") {
    return {
      banner_image_url: "",
      intro: cloneAboutIntro(),
      history: "",
      mission: "",
      vision: "",
      why_choose_us: [],
    };
  }

  if (page === "services") {
    return {
      banner_image_url: "",
      hero: cloneHero(),
      provided_services: [],
      property_services: [],
    };
  }

  if (page === "propertyList") {
    return {
      banner_image_url: "",
      title: "",
      subtitle: "",
    };
  }

  if (page === "propertyDetail") {
    return {
      show_related_properties: true,
      contact_title: "",
      contact_description: "",
      related_title: "",
      gallery_fallback: [],
    };
  }

  if (page === "contact") {
    return {
      banner_image_url: "",
      title: "",
      description: "",
      image: "",
    };
  }

  if (page === "layout") {
    return {
      footer_bg_url: "",
    };
  }

  return {};
}

function asRecord(content: unknown): Record<string, unknown> {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return {};
  }

  return content as Record<string, unknown>;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toEditableText(value: unknown): string {
  if (typeof value === "string") return value;

  const record = asRecord(value);
  return toText(record.description ?? record.content ?? record.title);
}

function toNullableText(value: unknown): string | null {
  const text = toText(value).trim();
  return text || null;
}

interface NormalizeItemOptions {
  includeLink?: boolean;
  includePoints?: boolean;
}

function normalizeItems(
  value: unknown,
  options: NormalizeItemOptions = {},
): RealstateContentItem[] {
  if (!Array.isArray(value)) return [];

  const includeLink = options.includeLink ?? true;
  const includePoints = options.includePoints ?? true;

  return value
    .map((item) => {
      const record = asRecord(item);
      const normalized: RealstateContentItem = {
        icon: toText(record.icon),
        title: toText(record.title),
        description: toText(record.description),
      };

      if (includeLink) normalized.link = toText(record.link);
      if (includePoints) {
        normalized.points = normalizeStringArray(record.points);
      }

      return normalized;
    })
    .filter((item) => item.title.trim() || item.description.trim());
}

function normalizeFeaturedSections(value: unknown): RealstateFeaturedSection[] {
  if (!Array.isArray(value)) return [];

  const groups = value
    .map((item) => {
      const record = asRecord(item);

      if (!Array.isArray(record.icons)) return null;

      const icons = normalizeFeaturedIcons(record.icons);

      if (!icons.length) return null;

      return {
        heading:
          toText(record.heading ?? record.title) || "Servicios destacados",
        type: toText(record.type) || "filter",
        icons,
      };
    })
    .filter(Boolean) as RealstateFeaturedSection[];

  if (groups.length) return groups;

  const legacyIcons = normalizeFeaturedIcons(value);

  return legacyIcons.length
    ? [
        {
          heading: "Servicios destacados",
          type: "filter",
          icons: legacyIcons,
        },
      ]
    : [];
}

function normalizeFeaturedIcons(value: unknown): RealstateFeaturedIcon[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        name: toText(record.name ?? record.title),
        icon: toText(record.icon) || EMPTY_FEATURED_ICON.icon,
        path: toText(record.path ?? record.link) || EMPTY_FEATURED_ICON.path,
      };
    })
    .filter((item) => item.name.trim() || item.icon.trim() || item.path.trim());
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => toText(item).trim()).filter(Boolean);
}

function normalizeEditableImages(value: unknown): RealstateEditableImage[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      const url = typeof item === "string" ? item : toText(record.url);

      return {
        url: url.trim(),
        alt: toText(record.alt),
      };
    })
    .filter((image) => image.url);
}

function normalizeAboutIntro(value: unknown): RealstateAboutIntroContent {
  const record = asRecord(value);

  return {
    title: toText(record.title),
    description: toText(record.description),
    images: normalizeEditableImages(record.images),
  };
}

function normalizeHero(value: unknown): RealstateHeroContent {
  const record = asRecord(value);

  return {
    ...record,
    label: toText(record.label),
    title: toText(record.title),
    subtitle: toText(record.subtitle),
    description: toText(record.description),
    image: toText(record.image),
    button_text: toText(record.button_text),
    button_link: toText(record.button_link),
  };
}

function cloneHero(): RealstateHeroContent {
  return { ...EMPTY_HERO };
}

function normalizeHomeSlides(value: unknown): RealstateHomeSlide[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      return {
        title: toText(record.title),
        description: toText(record.description),
        img: toText(record.img ?? record.image),
        link: toText(record.link),
        button_text: toText(record.button_text ?? record.buttonText),
      };
    })
    .filter(
      (item) =>
        item.title.trim() ||
        item.description.trim() ||
        item.img.trim() ||
        item.link.trim() ||
        item.button_text.trim(),
    );
}

function cloneItem(): RealstateContentItem {
  return { ...EMPTY_ITEM };
}

function cloneFeaturedIcon(): RealstateFeaturedIcon {
  return { ...EMPTY_FEATURED_ICON };
}

function cloneFeaturedSection(): RealstateFeaturedSection {
  return {
    ...EMPTY_FEATURED_SECTION,
    icons: [cloneFeaturedIcon()],
  };
}

function cloneHomeSlide(): RealstateHomeSlide {
  return { ...EMPTY_HOME_SLIDE };
}

function cloneAboutIntro(): RealstateAboutIntroContent {
  return {
    title: "",
    description: "",
    images: [],
  };
}

function normalizeContentForForm(
  page: RealstateSitePageKey,
  content: unknown,
): RealstateSitePageContent {
  const record = asRecord(content);

  if (page === "home") {
    return {
      ...record,
      background_image_url: toText(record.background_image_url),
      featured_sections_bg_url: toText(record.featured_sections_bg_url),
      hero_slides: normalizeHomeSlides(record.hero_slides ?? record.slides),
      featured_sections: normalizeFeaturedSections(record.featured_sections),
    };
  }

  if (page === "about") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      intro: normalizeAboutIntro(record.intro),
      history: toEditableText(record.history),
      mission: toEditableText(record.mission),
      vision: toEditableText(record.vision),
      why_choose_us: normalizeItems(record.why_choose_us, {
        includeLink: false,
        includePoints: false,
      }),
    };
  }

  if (page === "services") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      hero: normalizeHero(record.hero),
      provided_services: normalizeItems(record.provided_services, {
        includePoints: false,
      }),
      property_services: normalizeItems(record.property_services),
    };
  }

  if (page === "propertyList") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      title: toText(record.title),
      subtitle: toText(record.subtitle),
    };
  }

  if (page === "propertyDetail") {
    return {
      ...record,
      show_related_properties:
        typeof record.show_related_properties === "boolean"
          ? record.show_related_properties
          : true,
      contact_title: toText(record.contact_title),
      contact_description: toText(record.contact_description),
      related_title: toText(record.related_title),
      gallery_fallback: normalizeStringArray(record.gallery_fallback),
    };
  }

  if (page === "contact") {
    return {
      ...record,
      banner_image_url: toText(record.banner_image_url),
      title: toText(record.title),
      description: toText(record.description),
      image: toText(record.image),
    };
  }

  if (page === "layout") {
    return {
      ...record,
      footer_bg_url: toText(record.footer_bg_url),
    };
  }

  return record;
}

function normalizePage(
  page: RealstateSitePageKey,
  data: RealstateSitePage | undefined,
  templateSet: RealstateTemplateSet,
): RealstateSitePage {
  return {
    is_active: data?.is_active ?? true,
    template: data?.template ?? templateSet,
    content: normalizeContentForForm(page, data?.content),
  };
}

function normalizePages(
  pages: Partial<RealstateSitePages> | undefined,
  templateSet: RealstateTemplateSet,
): RealstateSitePages {
  return REALSTATE_SITE_PAGE_OPTIONS.reduce((normalized, page) => {
    normalized[page.id] = normalizePage(page.id, pages?.[page.id], templateSet);
    return normalized;
  }, {} as RealstateSitePages);
}

function setAdminTheme(theme: RealstateTheme) {
  if (!import.meta.client) return;

  customizerStore.setcolor(
    {
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
    },
    {
      persist: true,
    },
  );
}

function getThemePayload(theme: RealstateTheme): RealstateTheme {
  const normalized = normalizeRealstateTheme(theme);

  return {
    ...normalized,
    accent: normalized.primary,
  };
}

function applyTemplateData(data?: Partial<RealstateSiteTemplateData> | null) {
  if (!data) return;

  const theme = getThemePayload(normalizeRealstateTheme(data.theme));
  templateForm.value = {
    template_set: data.template_set ?? DEFAULT_TEMPLATE_SET,
    theme,
  };
  setAdminTheme(theme);
}

function getTemplateError(field: string): string | undefined {
  return templateErrors.value[field];
}

function getThemeError(field: ThemeFieldKey): string | undefined {
  return templateErrors.value[`theme.${field}`] ?? templateErrors.value[field];
}

function getPageError(field: string): string | undefined {
  return (
    currentPageErrors.value[field] ??
    currentPageErrors.value[`content.${field}`]
  );
}

function setPageErrors(
  page: RealstateSitePageKey,
  errors: Record<string, string>,
) {
  pageErrors.value = {
    ...pageErrors.value,
    [page]: errors,
  };
}

function validateTemplateForm(): boolean {
  const errors: Record<string, string> = {};

  if (
    !REALSTATE_TEMPLATE_OPTIONS.some(
      (template) => template.id === templateForm.value.template_set,
    )
  ) {
    errors.template_set = "Template inválido";
  }

  themeFields.forEach((field) => {
    if (!isHexThemeColor(templateForm.value.theme[field.key])) {
      errors[`theme.${field.key}`] =
        `${field.label} debe ser un hex de 6 dígitos`;
    }
  });

  templateErrors.value = errors;
  return !Object.keys(errors).length;
}

function getHeroPayload(hero: RealstateHeroContent): RealstateHeroContent {
  return {
    ...hero,
    label: toNullableText(hero.label),
    title: toNullableText(hero.title),
    subtitle: toNullableText(hero.subtitle),
    description: toNullableText(hero.description),
    image: toNullableText(hero.image),
    button_text: toNullableText(hero.button_text),
    button_link: toNullableText(hero.button_link),
  };
}

function getAboutIntroPayload(
  intro: RealstateAboutIntroContent,
): RealstateAboutIntroContent {
  return {
    title: toNullableText(intro.title),
    description: toNullableText(intro.description),
    images: normalizeEditableImages(intro.images).map((image) => ({
      url: image.url,
      alt: toNullableText(image.alt),
    })),
  };
}

function getKnownContentPayload(
  page: RealstateSitePageKey,
): RealstateSitePageContent {
  if (page === "home") {
    return {
      background_image_url: toNullableText(
        homeContent.value.background_image_url,
      ),
      featured_sections_bg_url: toNullableText(
        homeContent.value.featured_sections_bg_url,
      ),
      hero_slides: normalizeHomeSlides(homeContent.value.hero_slides),
      featured_sections: normalizeFeaturedSections(
        homeContent.value.featured_sections,
      ),
    };
  }

  if (page === "about") {
    return {
      ...aboutContent.value,
      banner_image_url: toNullableText(aboutContent.value.banner_image_url),
      intro: getAboutIntroPayload(aboutContent.value.intro),
      history: toNullableText(aboutContent.value.history),
      mission: toNullableText(aboutContent.value.mission),
      vision: toNullableText(aboutContent.value.vision),
      why_choose_us: normalizeItems(aboutContent.value.why_choose_us, {
        includeLink: false,
        includePoints: false,
      }),
    };
  }

  if (page === "services") {
    return {
      ...servicesContent.value,
      banner_image_url: toNullableText(servicesContent.value.banner_image_url),
      hero: getHeroPayload(servicesContent.value.hero),
      provided_services: normalizeItems(
        servicesContent.value.provided_services,
        { includePoints: false },
      ),
      property_services: normalizeItems(
        servicesContent.value.property_services,
      ),
    };
  }

  if (page === "propertyList") {
    return {
      ...propertyListContent.value,
      banner_image_url: toNullableText(
        propertyListContent.value.banner_image_url,
      ),
      title: toNullableText(propertyListContent.value.title),
      subtitle: toNullableText(propertyListContent.value.subtitle),
    };
  }

  if (page === "propertyDetail") {
    return {
      show_related_properties: Boolean(
        propertyDetailContent.value.show_related_properties,
      ),
      contact_title: toNullableText(propertyDetailContent.value.contact_title),
      contact_description: toNullableText(
        propertyDetailContent.value.contact_description,
      ),
      related_title: toNullableText(propertyDetailContent.value.related_title),
      gallery_fallback: normalizeStringArray(
        propertyDetailContent.value.gallery_fallback,
      ),
    };
  }

  if (page === "contact") {
    return {
      ...contactContent.value,
      banner_image_url: toNullableText(contactContent.value.banner_image_url),
      title: toNullableText(contactContent.value.title),
      description: toNullableText(contactContent.value.description),
      image: toNullableText(contactContent.value.image),
    };
  }

  if (page === "layout") {
    return {
      footer_bg_url: toNullableText(layoutContent.value.footer_bg_url),
    };
  }

  return asRecord(pagesForm.value[page].content);
}

async function getPagePayload(
  page: RealstateSitePageKey,
): Promise<RealstateSitePagePayload | null> {
  setPageErrors(page, {});

  return {
    is_active: Boolean(pagesForm.value[page].is_active),
    content: getKnownContentPayload(page),
  };
}

async function loadTemplate() {
  const response = await run(RealstateSiteManagementService.getTemplate());
  if (response?.data) {
    applyTemplateData(response.data);
    templateSnapshot.value = JSON.parse(JSON.stringify(templateForm.value));
    hasTemplateBackup.value = response.data.has_backup ?? false;
  }
}

async function loadPages() {
  const response = await run(RealstateSiteManagementService.getPages());

  if (!response?.data) return;

  applyTemplateData({
    template_set: response.data.template_set,
    theme: response.data.theme,
  });
  pagesForm.value = normalizePages(
    response.data.pages,
    response.data.template_set,
  );
  pagesSnapshot.value = JSON.parse(JSON.stringify(pagesForm.value));
  hasTemplateBackup.value = response.data.has_template_backup ?? hasTemplateBackup.value;
  pagesWithBackup.value = response.data.pages_with_backup ?? [];
}

async function loadAll() {
  isLoading.value = true;

  try {
    await loadTemplate();
    await loadPages();
  } finally {
    isLoading.value = false;
  }
}

function cancelTemplate() {
  if (!templateSnapshot.value) return;
  templateForm.value = JSON.parse(JSON.stringify(templateSnapshot.value));
  templateErrors.value = {};
}

function cancelPage() {
  if (!pagesSnapshot.value) return;
  const page = activePage.value;
  pagesForm.value = {
    ...pagesForm.value,
    [page]: JSON.parse(JSON.stringify(pagesSnapshot.value[page])),
  };
  setPageErrors(page, {});
}

async function doRestoreTemplate() {
  if (!canEditSiteSettings.value) return;

  isRestoringTemplate.value = true;

  try {
    const response = await run(
      RealstateSiteManagementService.restoreTemplate(),
      {
        showSuccess: true,
        successMessage: "Plantilla restaurada a la versión anterior",
        setErrors: (errors) => {
          templateErrors.value = errors;
        },
      },
    );

    if (response?.data) {
      applyTemplateData(response.data);
      templateSnapshot.value = JSON.parse(JSON.stringify(templateForm.value));
      hasTemplateBackup.value = response.data.has_backup ?? false;
      await loadPages();
    }
  } finally {
    isRestoringTemplate.value = false;
  }
}

async function doRestorePage() {
  if (!canEditSiteSettings.value) return;

  const page = activePage.value;
  isRestoringPage.value = true;

  try {
    const response = await run(
      RealstateSiteManagementService.restorePage(page),
      {
        showSuccess: true,
        successMessage: "Página restaurada a la versión anterior",
        setErrors: (errors) => setPageErrors(page, errors),
      },
    );

    if (response?.data?.config) {
      const normalized = normalizePage(
        page,
        response.data.config,
        templateForm.value.template_set,
      );
      pagesForm.value = { ...pagesForm.value, [page]: normalized };
      if (pagesSnapshot.value) {
        pagesSnapshot.value = {
          ...pagesSnapshot.value,
          [page]: JSON.parse(JSON.stringify(normalized)),
        };
      }
      pagesWithBackup.value = pagesWithBackup.value.filter((p) => p !== page);
    }
  } finally {
    isRestoringPage.value = false;
  }
}

async function saveTemplate() {
  if (!canEditSiteSettings.value) return;

  if (!validateTemplateForm()) {
    await AlertService.showFormError();
    return;
  }

  isSavingTemplate.value = true;

  try {
    const payload: RealstateSiteTemplatePayload = {
      template_set: templateForm.value.template_set,
      theme: getThemePayload(templateForm.value.theme),
    };
    const response = await run(
      RealstateSiteManagementService.updateTemplate(payload),
      {
        showSuccess: true,
        successMessage: "Template y colores actualizados correctamente",
        setErrors: (errors) => {
          templateErrors.value = errors;
        },
      },
    );

    if (response?.data) {
      applyTemplateData(response.data);
      templateSnapshot.value = JSON.parse(JSON.stringify(templateForm.value));
      hasTemplateBackup.value = response.data.has_backup ?? true;
      await loadPages();
    }
  } finally {
    isSavingTemplate.value = false;
  }
}

async function savePage(page: RealstateSitePageKey) {
  if (!canEditSiteSettings.value) return;

  const payload = await getPagePayload(page);
  if (!payload) return;

  isSavingPage.value = true;

  try {
    const response = await run(
      RealstateSiteManagementService.updatePage(page, payload),
      {
        showSuccess: true,
        successMessage: "Página actualizada correctamente",
        setErrors: (errors) => setPageErrors(page, errors),
      },
    );

    if (response?.data?.config) {
      const normalized = normalizePage(
        page,
        response.data.config,
        templateForm.value.template_set,
      );
      pagesForm.value = { ...pagesForm.value, [page]: normalized };
      if (pagesSnapshot.value) {
        pagesSnapshot.value = {
          ...pagesSnapshot.value,
          [page]: JSON.parse(JSON.stringify(normalized)),
        };
      }
      if (response.data.has_backup) {
        if (!pagesWithBackup.value.includes(page)) {
          pagesWithBackup.value = [...pagesWithBackup.value, page];
        }
      }
    }
  } finally {
    isSavingPage.value = false;
  }
}

async function saveActivePage() {
  await savePage(activePage.value);
}

function addHomeSlide() {
  if (!canEditSiteSettings.value) return;

  homeContent.value.hero_slides.push(cloneHomeSlide());
}

function removeHomeSlide(index: number) {
  if (!canEditSiteSettings.value) return;

  homeContent.value.hero_slides.splice(index, 1);
}

function addFeaturedSection() {
  if (!canEditSiteSettings.value) return;

  homeContent.value.featured_sections.push(cloneFeaturedSection());
}

function removeFeaturedSection(index: number) {
  if (!canEditSiteSettings.value) return;

  homeContent.value.featured_sections.splice(index, 1);
}

function addFeaturedIcon(sectionIndex: number) {
  if (!canEditSiteSettings.value) return;

  homeContent.value.featured_sections[sectionIndex]?.icons.push(
    cloneFeaturedIcon(),
  );
}

function removeFeaturedIcon(sectionIndex: number, iconIndex: number) {
  if (!canEditSiteSettings.value) return;

  homeContent.value.featured_sections[sectionIndex]?.icons.splice(iconIndex, 1);
}

function addWhyChooseUs() {
  if (!canEditSiteSettings.value) return;

  aboutContent.value.why_choose_us.push(cloneItem());
}

function removeWhyChooseUs(index: number) {
  if (!canEditSiteSettings.value) return;

  aboutContent.value.why_choose_us.splice(index, 1);
}

function addProvidedService() {
  if (!canEditSiteSettings.value) return;

  servicesContent.value.provided_services.push(cloneItem());
}

function removeProvidedService(index: number) {
  if (!canEditSiteSettings.value) return;

  servicesContent.value.provided_services.splice(index, 1);
}

function addPropertyService() {
  if (!canEditSiteSettings.value) return;

  servicesContent.value.property_services.push(cloneItem());
}

function removePropertyService(index: number) {
  if (!canEditSiteSettings.value) return;

  servicesContent.value.property_services.splice(index, 1);
}

function pointsToText(points?: string[]): string {
  return Array.isArray(points) ? points.join("\n") : "";
}

function setItemPoints(item: RealstateContentItem, event: Event) {
  const target = event.target as HTMLTextAreaElement | null;
  item.points = target?.value
    .split("\n")
    .map((point) => point.trim())
    .filter(Boolean);
}

onMounted(() => {
  void loadAll();
});
</script>

<style scoped>
.site-color-field {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}

.site-color-input {
  height: 42px;
  padding: 0.25rem;
  width: 72px;
}

.site-color-value {
  color: #6c757d;
  font-family: monospace;
}

.site-theme-preview {
  align-items: center;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--preview-primary) 16%, transparent),
      transparent 45%
    ),
    color-mix(in srgb, var(--preview-secondary) 8%, #ffffff);
  border: 1px solid rgba(88, 97, 103, 0.14);
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
}

.site-theme-preview small {
  color: #6c757d;
  display: block;
}

.preview-dot {
  border-radius: 50%;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
  display: inline-block;
  height: 28px;
  width: 28px;
}

.preview-dot-primary {
  background: var(--preview-primary);
}

.preview-dot-secondary {
  background: var(--preview-secondary);
}

.site-page-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(240px, 320px) 1fr;
}

.site-page-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.site-page-nav-item {
  border-radius: 12px;
  color: inherit;
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem 1rem;
  text-align: left;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.site-page-nav-item.active {
  border-color: var(--theme-default7);
  box-shadow: 0 10px 24px rgba(88, 97, 103, 0.12);
  transform: translateY(-1px);
}

.site-page-nav-item small {
  color: #6c757d;
  line-height: 1.35;
}

.site-page-nav-item .badge {
  justify-self: start;
}

.site-page-editor {
  min-width: 0;
}

.site-active-checkbox {
  margin-bottom: 0;
  min-width: 170px;
}

.repeatable-section {
  border-radius: 12px;
  margin-bottom: 1rem;
  padding: 1rem;
}

.repeatable-section h6 {
  margin: 0;
}

.repeatable-item {
  border-radius: 10px;
  margin-top: 0.85rem;
  padding: 1rem;
}

.featured-icon-item {
  border-radius: 10px;
  margin-top: 0.85rem;
  padding: 0.85rem;
}

:global(body.dark-layout) .site-theme-preview {
  background: #1f1f1f;
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
}

:global(body.dark-layout) .site-page-nav-item,
:global(body.dark-layout) .repeatable-section,
:global(body.dark-layout) .repeatable-item,
:global(body.dark-layout) .featured-icon-item {
  color: rgba(255, 255, 255, 0.88);
}

:global(body.dark-layout) .site-template-note {
  background: rgba(255, 255, 255, 0.035);
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.82);
}

:global(body.dark-layout) .site-management-page .text-muted,
:global(body.dark-layout) .site-theme-preview small,
:global(body.dark-layout) .site-page-nav-item small,
:global(body.dark-layout) .site-color-value {
  color: rgba(255, 255, 255, 0.62) !important;
}

:global(body.dark-layout) .site-page-nav-item.active {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--theme-default7) 12%, transparent),
      rgba(255, 255, 255, 0.04)
    ),
    #1f1f1f;
  border-color: var(--theme-default7);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
}

:global(body.dark-layout) .repeatable-section h6,
:global(body.dark-layout) .repeatable-item strong,
:global(body.dark-layout) .site-theme-preview strong,
:global(body.dark-layout) .site-page-nav-item > span:first-child {
  color: rgba(255, 255, 255, 0.9);
}

:global(body.dark-layout) .site-management-page textarea.form-control {
  background-color: #1f1f1f;
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.86);
}

@media (max-width: 991.98px) {
  .site-page-layout {
    grid-template-columns: 1fr;
  }
}
</style>
